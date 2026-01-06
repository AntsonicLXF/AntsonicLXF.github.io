// 黄历数据
const almanacData = {
    yi: [
        "祭祀", "祈福", "求嗣", "开光", "出行", "解除", "纳采", "订盟", "嫁娶", "会亲友",
        "入宅", "移徙", "安床", "修造", "动土", "上梁", "开市", "交易", "立券", "纳财",
        "赴任", "见贵", "求医", "治病", "入学", "安葬", "竖柱", "安门", "置产", "栽种"
    ],
    ji: [
        "伐木", "作梁", "安葬", "开市", "交易", "立券", "作灶", "出行", "入宅", "移徙",
        "嫁娶", "动土", "破土", "掘井", "扫舍", "上梁", "安床", "纳畜", "造桥", "盖屋"
    ],
    chongsha: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
    caishen: ["正东", "正南", "正西", "正北", "东南", "东北", "西南", "西北"]
};

// 运势描述
const fortuneData = {
    health: [
        { level: 90, text: "精力充沛，适合户外活动" },
        { level: 70, text: "状态良好，注意休息" },
        { level: 50, text: "稍有不适，多喝水" },
        { level: 30, text: "注意健康，避免劳累" }
    ],
    wealth: [
        { level: 90, text: "财运亨通，机会颇多" },
        { level: 70, text: "小有收获，理性消费" },
        { level: 50, text: "财运平稳，不宜投资" },
        { level: 30, text: "谨慎理财，避免借贷" }
    ],
    love: [
        { level: 90, text: "桃花旺盛，甜蜜温馨" },
        { level: 70, text: "感情稳定，多些浪漫" },
        { level: 50, text: "需要沟通，避免误解" },
        { level: 30, text: "单身为宜，专注自我" }
    ],
    work: [
        { level: 90, text: "效率极高，把握机会" },
        { level: 70, text: "进展顺利，团队合作" },
        { level: 50, text: "按部就班，避免变动" },
        { level: 30, text: "压力较大，保持耐心" }
    ]
};

// 每日提示
const dailyTips = [
    "微笑是最好的通行证，今天多笑笑吧！",
    "机会总是留给有准备的人，保持积极心态",
    "与人为善，收获的会是双倍的快乐",
    "小小的改变，可能会带来大大的不同",
    "今天适合尝试新事物，勇敢迈出第一步",
    "保持好奇心，生活会给你惊喜",
    "帮助他人，也是帮助自己",
    "享受当下，珍惜眼前的每一刻"
];

// 幸运颜色
const luckyColors = [
    "红色", "橙色", "黄色", "绿色", "蓝色", "紫色", "粉色", "金色", "银色", "白色", "黑色"
];

// 基于日期的哈希函数，确保每天运势相同
function getDailySeed() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
        hash |= 0; // 转换为32位整数
    }
    return Math.abs(hash);
}

// 伪随机数生成器
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// 从数组中随机选择（基于种子）
function selectFromArray(arr, count, seed) {
    const selected = [];
    const available = [...arr];
    
    for (let i = 0; i < count && available.length > 0; i++) {
        const index = Math.floor(seededRandom(seed + i) * available.length);
        selected.push(available[index]);
        available.splice(index, 1);
    }
    
    return selected;
}

// 获取随机运势
function getRandomFortune(seed) {
    const randomIndex = Math.floor(seededRandom(seed) * fortuneData.health.length);
    return randomIndex;
}

// 初始化页面
function initializePage() {
    const today = new Date();
    const seed = getDailySeed();
    
    // 设置日期
    document.getElementById('current-date').textContent = 
        `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${'日一二三四五六'[today.getDay()]}`;
    
    // 设置黄历信息
    document.getElementById('yi-list').textContent = 
        selectFromArray(almanacData.yi, 3, seed).join(' · ');
    document.getElementById('ji-list').textContent = 
        selectFromArray(almanacData.ji, 3, seed + 100).join(' · ');
    document.getElementById('chongsha').textContent = 
        `冲${selectFromArray(almanacData.chongsha, 1, seed + 200)[0]}`;
    document.getElementById('caishen').textContent = 
        selectFromArray(almanacData.caishen, 1, seed + 300)[0];
    
    // 设置运势
    const fortuneTypes = ['health', 'wealth', 'love', 'work'];
    fortuneTypes.forEach(type => {
        const fortuneIndex = getRandomFortune(seed + fortuneTypes.indexOf(type) * 10);
        const fortune = fortuneData[type][fortuneIndex];
        
        document.getElementById(`${type}-bar`).style.width = `${fortune.level}%`;
        document.getElementById(`${type}-text`).textContent = fortune.text;
    });
    
    // 设置每日提示
    const tipIndex = Math.floor(seededRandom(seed + 400) * dailyTips.length);
    document.getElementById('daily-tips').textContent = dailyTips[tipIndex];
    
    // 设置幸运数字和颜色
    const luckyNum = Math.floor(seededRandom(seed + 500) * 100);
    const colorIndex = Math.floor(seededRandom(seed + 600) * luckyColors.length);
    
    document.getElementById('lucky-number').textContent = luckyNum;
    document.getElementById('lucky-color').textContent = luckyColors[colorIndex];
    
    // 设置更新时间
    document.getElementById('update-time').textContent = 
        `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', initializePage);

// 添加PWA支持
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}