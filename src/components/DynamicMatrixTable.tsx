import React, {useState, useEffect} from 'react';
import './DynamicMatrixTable.css';

interface MatrixTableProps {
    /** 行数（进程数） */
    n: number;
    /** 列数（资源种类数） */
    m: number;
    /** 矩阵数据（支持一维/二维数组） */
    data: number[][] | number[];
    /** 数据变更回调 */
    onDataChange: ((newData: number[][]) => void) | ((newData: number[]) => void);
    corner: string;
}

const MatrixTable: React.FC<MatrixTableProps> = ({n, m, data, onDataChange, corner}) => {
    // 内部始终使用二维数组维护状态
    const [matrix, setMatrix] = useState<number[][]>(() =>
        initializeMatrix(n, m, data)
    );

    // 维度变化时重置矩阵
    useEffect(() => {
        const normalized = initializeMatrix(n, m, matrix);
        setMatrix(normalized);
        updateDataCallback(normalized);
    }, [n, m]);

    // 同步外部数据变化
    useEffect(() => {
        if (JSON.stringify(data) !== JSON.stringify(matrix)) {
            setMatrix(initializeMatrix(n, m, data));
        }
    }, [data]);

    // 统一的数据更新回调
    const updateDataCallback = (newMatrix: number[][]) => {
        const is1D = Array.isArray(data) && data.length > 0 && typeof data[0] === 'number';
        is1D
            ? (onDataChange as (newData: number[]) => void)(newMatrix.flat())
            : (onDataChange as (newData: number[][]) => void)(newMatrix);
    };

    // 单元格修改处理
    const handleCellChange = (row: number, col: number, value: string) => {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
            const newMatrix = matrix.map((r, i) =>
                r.map((cell, j) => (i === row && j === col ? numValue : cell))
            );
            setMatrix(newMatrix);
            updateDataCallback(newMatrix);
        }
    };

    // 表格头渲染
    const renderHeader = () => (
        <tr>
            <th>{corner}</th>
            {Array.from({length: m}, (_, i) => <th key={i}>C{i + 1}</th>)}
        </tr>
    );

    // 表格内容渲染
    const renderBody = () => matrix.map((row, i) => (
        <tr key={i}>
            <td className="row-label">R{i + 1}</td>
            {row.map((cell, j) => (
                <td key={j}>
                    <input
                        type="number"
                        min="0"
                        value={cell}
                        onChange={(e) => handleCellChange(i, j, e.target.value)}
                        className="cell-input"
                    />
                </td>
            ))}
        </tr>
    ));

    return (
        <div className="matrix-container">
            <table className="matrix-table">
                <thead>{renderHeader()}</thead>
                <tbody>{renderBody()}</tbody>
            </table>
        </div>
    );
};

// 矩阵初始化工具函数
const initializeMatrix = (n: number, m: number, source: number[][] | number[]): number[][] => {
    // 处理一维数组
    if (Array.isArray(source) && source.every(item => typeof item === 'number')) {
        return Array.from({length: n}, (_, i) =>
            Array.from({length: m}, (_, j) => source[i * m + j] || 0)
        );
    }
    // 处理二维数组
    return Array.from({length: n}, (_, i) =>
        Array.from({length: m}, (_, j) => (source as number[][])[i]?.[j] || 0)
    );
};

export default MatrixTable;