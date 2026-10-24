// Pure, dependency-free split calculation. All arithmetic uses integer minor units.
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

export function parseAmount(value, currency = "JPY") {
  const digits = currencyDigits(currency);
  const input = String(value).trim().replace(/,/g, "");
  const expression = digits === 0 ? /^(0|[1-9]\d{0,8})$/ : /^(0|[1-9]\d{0,8})(?:\.(\d{1,2}))?$/;
  const match = input.match(expression);
  if (!match) throw new Error(digits ? "請輸入正確金額（最多小數點兩位）。" : "日圓金額請使用整數。");
  const factor = 10 ** digits;
  const result = Number(match[1]) * factor + (digits ? Number((match[2] || "").padEnd(digits, "0")) : 0);
  if (!Number.isSafeInteger(result) || result < 1 || result > 999999999) throw new Error("金額必須大於零且不超過允許的上限。");
  return result;
}

export function calculateLedger(members, expenses) {
  const balances = new Map(members.map(member => [member.uid, 0]));
  let totalMinor = 0;
  let skipped = 0;
  for (const bill of expenses) {
    const amount = bill.amountMinor;
    const recipients = Array.isArray(bill.participantUids)
      ? [...new Set(bill.participantUids)].sort()
      : [];
    if (!Number.isSafeInteger(amount) || amount <= 0 || !balances.has(bill.payerUid) ||
        recipients.length === 0 || recipients.some(uid => !balances.has(uid))) {
      skipped++;
      continue;
    }
    totalMinor += amount;
    balances.set(bill.payerUid, balances.get(bill.payerUid) + amount);
    const perHead = Math.floor(amount / recipients.length);
    const extra = amount % recipients.length;
    recipients.forEach((uid, index) => {
      balances.set(uid, balances.get(uid) - perHead - (index < extra ? 1 : 0));
    });
  }
  const rows = members.map(member => ({ ...member, netMinor: balances.get(member.uid) || 0 }));
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
    if (value > 0) transfers.push({ from: debtors[di].uid, to: creditors[ci].uid, amountMinor: value });
    creditors[ci].left -= value;
    debtors[di].left -= value;
    if (creditors[ci].left === 0) ci++;
    if (debtors[di].left === 0) di++;
  }
  return { balances: rows, transfers, totalMinor, skipped };
}
