export function firstName(fullName) {
  return fullName.replace(/^(Dr|Dra|Sr|Sra)\.\s*/i, '').split(' ')[0];
}
