import React, {useState, useCallback, useEffect} from 'react';
import axios from 'axios';
import DynamicMatrixTable from '../components/DynamicMatrixTable';
import './BankerInputPage.css';
import SafeSequence from "../components/SafeSequence";
import DropDownMenu from "../components/DropDownMenu";
import {HistoryItem} from "../components/DropDownMenu";

const BankerInputPage: React.FC = () => {
    // 声明 ref
    const safeSequenceRef = React.useRef<HTMLDivElement>(null);
    // 单独的状态管理
    const [n, setN] = useState(4);
    const [m, setM] = useState(3);
    const [requestProcess, setRequestProcess] = useState(3);//是哪个进程请请求
    // 资源相关状态拆分
    const [available, setAvailable] = useState<number[]>([9, 3, 6]);
    const [request, setRequest] = useState<number[]>([1, 1, 0]);//请求资源
    const [need, setNeed] = useState<number[][]>([[3, 2, 2], [6, 1, 3], [3, 1, 4], [4, 2, 2]]);
    const [allocation, setAllocation] = useState<number[][]>([[1, 0, 0], [5, 1, 1], [2, 1, 1], [0, 0, 2]]);
    const [max, setMax] = useState<number[][]>([[4, 2, 2], [11, 2, 4], [5, 2, 5], [4, 2, 4]]);
    const [executeTime, setExecuteTime] = useState<number[]>([5, 7, 9, 10]);//进程的执行时间
    const [safeSequence, setSafeSequence] = useState<number[][]>([]);//安全序列
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);


    //确保max=need+allocation
    useEffect(() => {
        const newMax = need.map((needRow, i) =>
            needRow.map((needVal, j) =>
                needVal + (allocation[i]?.[j] || 0)
            )
        );
        setMax(newMax);
    }, [need, allocation]);

    //检验max==need+allocation
    const validateMaxChange = (newMax: number[][]) => {
        const computedMax = need.map((needRow, i) =>
            needRow.map((needVal, j) =>
                needVal + (allocation[i][j] || 0)
            )
        );
        if (JSON.stringify(newMax) === JSON.stringify(computedMax)) {
            setMax(newMax);
        }
    };


    /*
        随机生成矩阵
     */
    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/generate', {
                params: {n, m, requestProcess}
            });

            const data = response.data.data;
            const normalizeArray = (arr: unknown, fallback: any[] = []) =>
                Array.isArray(arr) ? arr : fallback;

            // 独立设置各个资源状态
            setAvailable(normalizeArray(data.available, new Array(data.m).fill(0)));
            setRequest(normalizeArray(data.request, new Array(data.m).fill(0)));
            setNeed(normalizeArray(data.need, new Array(data.n).fill(new Array(data.m).fill(0))));
            setAllocation(normalizeArray(data.allocation, new Array(data.n).fill(new Array(data.m).fill(0))));
            setMax(normalizeArray(data.max,new Array(data.n).fill(new Array(data.m).fill(0))));
            setExecuteTime(normalizeArray(data.executeTime, new Array(data.n).fill(0)));

            console.log('数据获取成功:', data);
            console.log('数据获取成功:', data.available);
            console.log('数据获取成功:', data.request);
            console.log('数据获取成功:', data.need);
            console.log('数据获取成功:', data.allocation);
            console.log('数据获取成功:', data.max);
            console.log('数据获取成功:', data.executeTime);

            console.log('修改后', available);
            console.log('修改后', request);
            console.log('修改后', need);
            console.log('修改后', allocation);
            console.log('修改后', max);

        } catch (error) {
            alert('数据获取失败×');
            console.error('数据获取失败:', error);
        }
    }, [n, m, requestProcess]);

    /*
        保存当前矩阵
     */
    const saveMatrix = async () => {
        try {
            const payload = {
                n,
                m,
                requestProcess,
                available,
                request,
                need,
                allocation,
                max,
                executeTime
            };

            await axios.post('http://localhost:8080/api/save', payload, {
                headers: {'Content-Type': 'application/json'}
            });
            console.log('配置保存成功');
            alert('配置保存成功√');
        } catch (error) {
            alert('配置保存失败×');
            console.error('保存配置失败:', error);
        }
    };

    /*
        生成安全序列
     */
    const calculateSafeSequence = async () => {
        try {
            const payload = {
                n,
                m,
                requestProcess,
                available,
                allocation,
                max,
                request,
                need,
                executeTime
            };

            console.log('发送的配置数据:', payload);

            // 使用POST请求并设置请求体
            const response = await axios.post(
                'http://localhost:8080/api/dispatch',
                payload,
                {
                    headers: {'Content-Type': 'application/json'}
                }
            );

            console.log('安全序列:', response.data.data.dispatchSequence);
            console.log('安全序列:', response.data.data);

            setSafeSequence(response.data.data);

        } catch (error) {
            alert('计算失败×');
            console.error('计算失败:', error);
        }
    };

    /*
        获取全部矩阵历史数据
     */
    const fetchHistory = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/list'); // 假设后端有此接口
            const items = response.data.data as HistoryItem[];

            // console.log('历史记录:', items)
            // console.log('历史记录:', items[0].createTime)

            setHistoryItems(items);
        } catch (error) {
            console.error('获取历史记录失败:', error);
        }
    }, []);

    // 选择历史项时加载具体矩阵的函数
    const handleSelectHistory = useCallback(async (selectedItem: HistoryItem) => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/load?createTime=${selectedItem.createTime}` // 假设需要ID参数
            );
            const data = response.data.data;

            const normalizeArray = (arr: unknown, fallback: any[] = []) =>
                Array.isArray(arr) ? arr : fallback;

            // 更新所有相关状态
            setN(data.n);
            setM(data.m);
            setRequestProcess(data.requestProcess);

            // 独立设置各个资源状态
            setAvailable(normalizeArray(data.available, new Array(data.m).fill(0)));
            setRequest(normalizeArray(data.request, new Array(data.m).fill(0)));
            setNeed(normalizeArray(data.need, new Array(data.n).fill(new Array(data.m).fill(0))));
            setAllocation(normalizeArray(data.allocation, new Array(data.n).fill(new Array(data.m).fill(0))));
            setMax(normalizeArray(data.max, new Array(data.n).fill(new Array(data.m).fill(0))));
            setExecuteTime(normalizeArray(data.executeTime, new Array(data.n).fill(0)));

            // setMatrix(data);

            console.log();
            console.log('数据获取成功:', data);
            console.log('数据获取成功avai:', data.available);
            console.log('数据获取成功req:', data.request);
            console.log('数据获取成功need:', data.need);
            console.log('数据获取成功alloc:', data.allocation);
            console.log('数据获取成功max:', data.max);
            console.log('数据获取成功exe:', data.executeTime);

            console.log();
            console.log('修改后avai', available);
            console.log('修改后req', request);
            console.log('修改后need', need);
            console.log('修改后alloc', allocation);
            console.log('修改后max', max);
            console.log('修改后exe', executeTime)


        } catch (error) {
            console.error('加载历史矩阵失败:', error);
        }
    }, []);



    // 在组件挂载时自动获取历史记录
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory, n, m, requestProcess, need]);


    /*
        处理控制面板输入变化
     */
    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = Math.max(0, parseInt(e.target.value) || 0);
            setter(value);
        };


    /*
        设置请求进程的范围在0~n-1
     */
    const handleProcessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, parseInt(e.target.value) || 0);
        setRequestProcess(prev => Math.min(value, n - 1));
    };

    /*
        渲染矩阵
     */
    const renderMatrixTable = (
        title: string,
        data: number[] | number[][],
        rows: number,
        cols: number,
        onDataChange: ((data: number[][]) => void) | ((data: number[]) => void),
        corner: string
    ) => (
        <div className="matrix-container">
            <h3>{title}</h3>
            <DynamicMatrixTable
                n={rows}
                m={cols}
                data={Array.isArray(data[0]) ? data as number[][] : data as number[]}
                onDataChange={Array.isArray(data[0]) ? onDataChange as (data: number[][]) => void : onDataChange as (data: number[]) => void}
                corner={corner}
            />
        </div>
    );


    /*
        渲染控制面板输入框
     */
    const renderDimensionInput = (
        label: string,
        value: number,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        minValue: number = 1
    ) => (
        <div className="input-item">
            <span className="input-label">{label}:</span>
            <input
                type="number"
                min={minValue}
                className="dimension-input"
                value={value}
                onChange={onChange}
            />
        </div>
    );

    /*
        渲染滑动表
     */
    const renderSafeSequenceTable = (safeSequence: number[][]) => {
        return (
            <SafeSequence safeSequences={safeSequence}/>
        );
    };

    /*
        渲染下拉列表
     */
    const renderDropDownMenu = () => (
        <div className="dropdown-container">
            <DropDownMenu
                items={historyItems}
                onSelect={handleSelectHistory}
            />
        </div>
    );


    /*
        滑动到安全序列表格
     */
    const scrollToSafeSequence = () => {
        safeSequenceRef.current?.scrollIntoView({
            behavior: 'smooth',  // 平滑滚动效果
            block: 'start'       // 对齐方式
        });
    };


    return (
        <div className="page-container">
            <h1>银行家算法</h1>
            <div className="control-panel">
                <h3>控制面板</h3>
                <div className="dimension-controls">
                    {renderDimensionInput('进程数(n)', n, handleInputChange(setN))}
                    {renderDimensionInput('资源数(m)', m, handleInputChange(setM))}
                    {renderDimensionInput('请求进程', requestProcess, handleProcessChange, 0)}
                </div>

                {/*<div className="drop-down">*/}
                {/*    {renderDropDownMenu(historyItems, handleSelectHistory)}*/}
                {/*</div>*/}

                <div className="action-buttons">
                    <button className="control-buttons" onClick={fetchData}>随机生成</button>
                    <button className="control-buttons" onClick={saveMatrix}>保存矩阵</button>
                    <button className="control-buttons" onClick={() => {
                        calculateSafeSequence();
                        scrollToSafeSequence();
                    }}>计算安全序列
                    </button>
                    {renderDropDownMenu()}
                </div>
            </div>

            <div className="matrix-grid">
                {renderMatrixTable('进程执行时间', executeTime, 1, n, setExecuteTime, '进程执行时间')}
                {renderMatrixTable('请求矩阵Request', request, 1, m, setRequest, '进程请求资源')}
                {renderMatrixTable('可用资源Available', available, 1, m, setAvailable, '可用资源数量')}
                {renderMatrixTable('分配矩阵Allocation', allocation, n, m, setAllocation, '进程\\资源')}
                {renderMatrixTable('需求矩阵Need', need, n, m, setNeed, '进程\\资源')}
                {renderMatrixTable('最大需求矩阵Max', max, n, m, validateMaxChange, '进程\\资源')}
                {/*{renderMatrixTable('最大需求矩阵Max', max, n, m, setMax, '进程\\资源')}*/}

            </div>

            <div ref={safeSequenceRef} className="safe-sequence-table">
                {renderSafeSequenceTable(safeSequence)}
            </div>
        </div>
    );
};

export default BankerInputPage;
