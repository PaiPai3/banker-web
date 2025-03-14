import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DynamicMatrixTable from './components/DynamicMatrixTable';
import DropDownMenu, {HistoryItem} from './components/DropDownMenu'; // 根据实际路径调整导入
import BankerInputPage from './pages/BankerInputPage'; // 导入 BankerInputPage 组件
import BankerOutputPage from './components/SafeSequence';
import './App.css';

// 定义导航项类型
type NavItem = {
    path: string;
    name: string;
    icon?: React.ReactNode;
};

const App: React.FC = () => {
    // 导航配置（可扩展）
    const navItems: NavItem[] = [
        {
            path: '/analytics',
            name: '数据分析',
            icon: '📊',
        },
        {
            path: '/banker-input',
            name: '银行家算法',
            icon: '🏦', // 添加新的导航项
        }
    ];

    return (
        <Router>
            <div className="app-container">
                <Sidebar navItems={navItems}/>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        {/*<Route path="/analytics" element={<DemoPage/>}/>*/}
                        <Route path="/analytics" element={<HistoryDropdown/>}/>
                        <Route path="/banker-input" element={<BankerInputPage/>}/> {/* 添加新的路由 */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};


// 示例页面组件
const HomePage = () => {
    return (
        <h1>安徽大学25年春系统软件作业</h1>
    );
};
const AnalyticsPage = () => {
    return (
        <h1>数据分析页面（预留位置）</h1>
    );
};

// 在 App.tsx 中添加新组件
const HistoryDropdown: React.FC = () => {
    // 独立管理历史记录状态
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
        {
            n: 4,
            m: 3,
            requestProcess: 2,
            createTime: new Date('2024-01-01'),
        },
        {
            n: 5,
            m: 4,
            requestProcess: 3,
            createTime: new Date('2024-02-01'),
        },
    ]);

    // 处理选择事件
    const handleSelect = (item: HistoryItem) => {
        console.log('选中历史项:', item);
    };

    return (
        <div className="history-dropdown-container">
            <h2>历史记录选择器</h2>
            <DropDownMenu
                items={historyItems}
                onSelect={handleSelect}
            />
        </div>
    );
};

export default App;
