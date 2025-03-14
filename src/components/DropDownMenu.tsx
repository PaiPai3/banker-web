import React, {useState} from 'react';
import './DropDownMenu.css';

export interface HistoryItem {
    n: number;
    m: number;
    requestProcess: number;
    createTime: Date;
}

interface DropDownMenuProps {
    items: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({items, onSelect}) => {
    // 新增状态保存选中项
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

    return (
        <select
            className="dropdown-trigger"
            value={selectedItem ? JSON.stringify(selectedItem) : ''}  // 绑定选中值
            onChange={(e) => {
                const selectedItem = JSON.parse(e.target.value);
                setSelectedItem(selectedItem);  // 更新状态
                onSelect(selectedItem);         // 触发回调
            }}
        >
            {/* 默认选项 */}
            <option value="">请选择</option>

            {items.map(item => (
                <option
                    key={item.createTime.toString()}
                    value={JSON.stringify(item)}
                >
                    Matrix: n={item.n}, m={item.m}, process={item.requestProcess},
                    时间：{item.createTime.toLocaleString()}
                </option>

            ))}
        </select>
    );
};

export default DropDownMenu;
