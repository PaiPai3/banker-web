
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DynamicMatrixTable from './components/DynamicMatrixTable';
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
            path: '/matrix',
            name: '动态矩阵',
            icon: '🧮',
        },
        {
            path: '/analytics',
            name: '数据分析',
            icon: '📊',
        },
        {
            path: '/banker-input',
            name: '银行家算法',
            icon: '🏦', // 添加新的导航项
        },
        {
            path: '/banker-output',
            name: '安全序列',
            icon: '🏦', // 添加新的导航项
        }
    ];

    return (
        <Router>
            <div className="app-container">
                <Sidebar navItems={navItems} />

                <main className="main-content">
                    <Routes>
                        <Route path="/matrix" element={<DynamicMatrixTablePage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/banker-input" element={<BankerInputPage />} /> {/* 添加新的路由 */}
                        <Route path="/banker-output" element={<GoBankerOutputPage/>} /> {/* 添加新的路由 */}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

const GoBankerOutputPage = () => {
    // 示例数据：包含两个安全序列的二维数组
    const sampleSequences = [
        [0, 1, 2],  // 第一个安全序列
        [2, 1, 0]   // 第二个安全序列
    ];

    return (
        <div>
            <BankerOutputPage safetySequences={sampleSequences} />
        </div>
    );
}

// 示例页面组件
const HomePage = () => <h1>欢迎使用矩阵工具集</h1>;
const AnalyticsPage = () => <h1>数据分析页面（预留位置）</h1>;

// 动态矩阵页面的容器组件
const DynamicMatrixTablePage = () => {
    const [n, setN] = React.useState(3);
    const [m, setM] = React.useState(3);
    const [data, setData] = React.useState<number[][]>([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
    ]);

    const handleGenerateMatrix = () => {
        const newData = Array.from({ length: n }, () =>
            Array.from({ length: m }, () => Math.floor(Math.random() * 10))
        );
        setData(newData);
        console.log(newData);
    };

    const handleNChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setN(Number(event.target.value));
    };

    const handleMChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setM(Number(event.target.value));
    };

    return (
        <div className="page-container">
            {/* 原App.tsx中的控制逻辑 */}
            <div className="controls">
                <label>
                    行数(n):
                    <input type="number" value={n} onChange={handleNChange} />
                </label>
                <label>
                    列数(m):
                    <input type="number" value={m} onChange={handleMChange} />
                </label>
                <button onClick={handleGenerateMatrix}>
                    生成矩阵
                </button>
            </div>

            <DynamicMatrixTable
                n={n}
                m={m}
                data={data}
                onDataChange={setData}
            />
        </div>
    );
};



export default App;
