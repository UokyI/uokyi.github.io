// theme.js - 主题管理模块
(function() {
    // 添加设置favicon的函数
    function setFavicon() {
        // 根据当前页面路径确定图片路径
        const pathParts = window.location.pathname.split('/');
        // 计算相对路径，从根目录到img文件夹
        let imagePath = '';
        console.log(pathParts);
        if (pathParts.length > 2) {
            // 计算需要多少个../来返回到根目录
            const depth = pathParts.length - 1; // 减2是因为包含域名和最后的文件
            imagePath = '../'.repeat(depth - 1) + 'img/logo.png';
        } else {
            // 如果在根目录，则直接使用 ./img/logo.png
            imagePath = './img/logo.png';
        }
        
        const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = imagePath;
        
        if (!document.querySelector('link[rel="icon"]')) {
            document.head.appendChild(favicon);
        }
    }
    
    // 在DOM加载完成后设置favicon
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setFavicon);
    } else {
        setFavicon();
    }
    
    // 主题管理类
    class ThemeManager {
        constructor() {
            this.themeToggle = null;
            this.init();
        }
        
        // 初始化
        init() {
            // 等待DOM加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupThemeToggle());
            } else {
                this.setupThemeToggle();
            }
            
            // 应用保存的主题
            this.applySavedTheme();
            
            // 监听系统主题变化
            this.watchSystemTheme();
        }
        
        // 设置主题切换按钮
        setupThemeToggle() {
            this.themeToggle = document.getElementById('themeToggle');
            if (this.themeToggle) {
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
                this.updateToggleText();
            }
        }
        
        // 获取首选主题
        getPreferredTheme() {
            // 检查本地存储
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            
            // 检查系统偏好
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            
            return 'light';
        }
        
        // 应用保存的主题
        applySavedTheme() {
            const theme = this.getPreferredTheme();
            this.setTheme(theme);
        }
        
        // 设置主题
        setTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            
            localStorage.setItem('theme', theme);
            this.updateToggleText();
        }
        
        // 切换主题
        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        }
        
        // 更新切换按钮文本
        updateToggleText() {
            if (this.themeToggle) {
                const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
                this.themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
            }
        }
        
        // 监听系统主题变化
        watchSystemTheme() {
            if (window.matchMedia) {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                    // 只有在没有用户手动设置主题时才跟随系统变化
                    if (!localStorage.getItem('theme')) {
                        this.setTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }
    }
    
    // 创建主题管理器实例
    window.themeManager = new ThemeManager();
    
    // 如果需要立即应用主题（在DOMContentLoaded之前）
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();