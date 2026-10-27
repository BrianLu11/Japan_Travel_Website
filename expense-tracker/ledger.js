// Integer-minor-unit arithmetic for both equal and custom expense allocation.
export function currencyDigits(currency) {
  return ["JPY", "KRW", "TWD"].includes(currency) ? 0 : 2;
}

export function formatMoney(minor, currency = "JPY") {
  const digits = currencyDigits(currency);
  return new Intl.NumberFormat("zh-TW", {
    style: "currency", currency, minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(minor / (10 ** digits));
}

function parseMinorUnits(value, currency, allowZero) {
  const digits = currencyDigits(currency);
  const input = String(value).trim().replace(/,/g, "");
  const pattern = digits === 0
    ? /^(0|[1-9]\d{0,8})$/
    : /^(0|[1-9]\d{0,8})(?:\.(\d{1,2}))?$/;
  const match = input.match(pattern);
  if (!match) {
    throw new Error(digits
      ? "請輸入正確金額（最多小數點兩位）。"
      : "金額請使用非負整數。");
  }
  const factor = 10 ** digits;
  const amount = Number(match[1]) * factor +
    (digits ? Number((match[2] || "").padEnd(digits, "0")) : 0);
  if (!Number.isSafeInteger(amount) || amount > 999999999 || (!allowZero && amount < 1)) {
    throw new Error("金額超出允許範圍（總支出必須大於零）。");
  }
  return amount;
}

// Total expense must be strictly positive; an individual's share may be zero.
export function parseAmount(value, currency = "JPY") {
  return parseMinorUnits(value, currency, false);
}
export function parseShare(value, currency = "JPY") {
  return parseMinorUnits(value, currency, true);
}

function sortedRecipients(participantUids) {
  if (!Array.isArray(participantUids) || participantUids.length === 0 ||
      participantUids.length > 40 || participantUids.some(uid => typeof uid !== "string" || !uid)) {
    throw new Error("至少需要一位有效的分攤成員（最多 40 人）。");
  }
  const unique = [...new Set(participantUids)].sort();
  if (unique.length !== participantUids.length) throw new Error("分攤成員不得重複。");
  return unique;
}

export function equalShares(amountMinor, participantUids) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0 || amountMinor > 999999999) {
    throw new Error("總金額無效。");
  }
  const recipients = sortedRecipients(participantUids);
  const each = Math.floor(amountMinor / recipients.length);
  const remainder = amountMinor % recipients.length;
  const shares = {};
  recipients.forEach((uid, index) => {
    shares[uid] = each + (index < remainder ? 1 : 0);
  });
  return shares;
}

// Validate a user-defined split. Do not silently rebalance an incorrect total.
// This is also used on Firestore reads so invalid records cannot alter balances.
export function validateCustomShares(amountMinor, participantUids, sharesMinor) {
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0 || amountMinor > 999999999) {
    throw new Error("總金額無效。");
  }
  const recipients = sortedRecipients(participantUids);
  if (!sharesMinor || typeof sharesMinor !== "object" || Array.isArray(sharesMinor)) {
    throw new Error("缺少每人的自訂金額。");
  }
  const keys = Object.keys(sharesMinor);
  if (keys.length !== recipients.length || keys.some(uid => !recipients.includes(uid))) {
    throw new Error("每位分攤成員都需要一個對應的金額。");
  }
  let sum = 0;
  const clean = {};
  for (const uid of recipients) {
    const share = sharesMinor[uid];
    if (!Number.isSafeInteger(share) || share < 0 || share > amountMinor) {
      throw new Error("每人的分攤金額必須是有效且非負的最小貨幣單位整數。");
    }
    sum += share;
    clean[uid] = share;
  }
  if (sum !== amountMinor) {
    throw new Error("各人自訂金額加總必須等於總支出。");
  }
  return clean;
}

export function expenseShares(bill) {
  const mode = bill.splitMode || "equal"; // Legacy expenses without splitMode remain equal.
  if (mode === "equal") return equalShares(bill.amountMinor, bill.participantUids);
  if (mode === "custom") {
    return validateCustomShares(bill.amountMinor, bill.participantUids, bill.sharesMinor);
  }
  throw new Error("不支援的分攤方式。");
}

export function calculateLedger(members, expenses) {
  const balances = new Map(members.map(person => [person.uid, 0]));
  let totalMinor = 0, skipped = 0;
  for (const bill of expenses) {
    try {
      if (!balances.has(bill.payerUid)) throw new Error("付款人不是有效旅伴。");
      const shares = expenseShares(bill);
      if (Object.keys(shares).some(uid => !balances.has(uid))) {
        throw new Error("分攤者不是有效旅伴。");
      }
      totalMinor += bill.amountMinor;
      balances.set(bill.payerUid, balances.get(bill.payerUid) + bill.amountMinor);
      for (const [uid, share] of Object.entries(shares)) {
        balances.set(uid, balances.get(uid) - share);
      }
    } catch {
      skipped++;
    }
  }
  const rows = members.map(person => ({ ...person, netMinor: balances.get(person.uid) || 0 }));
  const creditors = rows.filter(row => row.netMinor > 0)
    .map(row => ({ uid: row.uid, left: row.netMinor }))
    .sort((a, b) => b.left - a.left || a.uid.localeCompare(b.uid));
  const debtors = rows.filter(row => row.netMinor < 0)
    .map(row => ({ uid: row.uid, left: -row.netMinor }))
    .sort((a, b) => b.left - a.left || a.uid.localeCompare(b.uid));
  const transfers = [];
  let ci = 0, di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const value = Math.min(creditors[ci].left, debtors[di].left);
    if (value > 0) {
      transfers.push({ from: debtors[di].uid, to: creditors[ci].uid, amountMinor: value });
    }
    creditors[ci].left -= value;
    debtors[di].left -= value;
    if (creditors[ci].left === 0) ci++;
    if (debtors[di].left === 0) di++;
  }
  return { balances: rows, transfers, totalMinor, skipped };
}
