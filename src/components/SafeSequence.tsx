import React from 'react';
import './SafeSequence.css';

interface Props {
  safetySequences: number[][];
}

const SafeSequence: React.FC<Props> = ({ safetySequences }) => {
  return (
    <div className="sequence-container">
      <h2>安全序列列表</h2>
      {safetySequences.length > 0 ? (
        <div className="scroll-wrapper">
          <table className="sequence-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>序号</th>
                <th style={{ width: '85%' }}>安全序列</th>
              </tr>
            </thead>
            <tbody>
              {safetySequences.map((sequence, index) => (
                <tr key={index}>
                  <td className="index-cell">{index + 1}</td>
                  <td className="sequence-cell">
                    [ {sequence.join(' → ')} ]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">⚠️ 未找到安全序列</div>
      )}
    </div>
  );
};

export default React.memo(SafeSequence);
