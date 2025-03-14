import React from 'react';
import {Link} from 'react-router-dom';
import './Sidebar.css';

/**
 * 导航项接口
 * @path 导航项的路径
 * @name 导航项的名称
 * @icon 导航项的图标，可选
 */
interface NavItem {
    path: string;
    name: string;
    icon?: React.ReactNode;
}

/**
 * 侧边栏组件属性接口
 * @navItems 导航项数组
 */
interface SidebarProps {
    navItems: NavItem[];
}

/**
 * 侧边栏组件
 * @param {SidebarProps} props 侧边栏组件的属性
 * @returns 返回侧边栏组件
 */
const Sidebar: React.FC<SidebarProps> = ({navItems}) => {
    return (
        <div className="sidebar">
            {/* Logo 区域 */}
            <div className="logo-container">
                <Link to="/" className="logo">
                    <span className="logo-icon">⚛️</span>
                    <span className="logo-text">系统软件作业集成页面</span>
                </Link>
            </div>

            {/* 导航菜单 */}
            <nav className="nav-menu">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="nav-item"
                    >
                        {item.icon && <span className="nav-icon">{item.icon}</span>}
                        <span className="nav-text">{item.name}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;
