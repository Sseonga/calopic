

export default function TableTab({
  tabType,
  headers = [],            // 예: ['이름','분류','...','']  ← 마지막 ''이면 헤더 체크박스
  rows = [],
  renderRow,               // (row, idx) => <tr>...</tr>
  minRows = 12,
  onSelectAll,
  allChecked = false,
  colGroup,                // 예: [{width:'12%'}, ...]  헤더 개수와 동일 길이 권장
}) {
  const safeRenderRow = renderRow ?? (() => null);
  const emptyRowCount = Math.max(0, minRows - rows.length);

  return (
    <table className="report-check-table">
      {/* 열 너비가 필요하면 colGroup 넘기기 (테이블마다 다르게 가능) */}
      {Array.isArray(colGroup) && colGroup.length > 0 && (
        <colgroup>
          {colGroup.map((style, i) => (
            <col key={i} style={style} />
          ))}
        </colgroup>
      )}

      <thead>
        <tr>
          {(headers || []).map((text, idx) => (
            <th key={`th-${idx}`}>
              {text || (
                <input
                  type="checkbox"
                  onChange={onSelectAll}
                  checked={allChecked}
                  aria-label="전체 선택"
                />
              )}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, idx) => safeRenderRow(row, idx))}

        {/* 빈 줄 채우기: 헤더 개수 기준으로 생성 */}
        {Array.from({ length: emptyRowCount }, (_, r) => (
          <tr key={`empty-${r}`}>
            {Array.from({ length: headers.length || 1 }, (_, c) => (
              <td key={`empty-td-${r}-${c}`}>&nbsp;</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
