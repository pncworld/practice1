export function formatLocalDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


export function excelTitle(target) {
      const first = target.strMajorName 
      const second = target.strSubName 
      const third = target.strTitle

      return `${first}-${second}-${third}`;
  }