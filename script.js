// SyPlugins 官网交互脚本
// Apple 风格动画和交互效果

document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initParallaxEffect();
});

/**
 * 导航栏功能
 * - 滚动时改变透明度
 * - 移动端菜单切换
 */
function initNavigation() {
    const nav = document.querySelector('.nav');
    const menuToggle = document.querySelector('.nav-menu-toggle');
    let lastScrollY = window.scrollY;
    let ticking = false;

    // 滚动时更新导航栏样式
    function updateNav() {
        const currentScrollY = window.scrollY;
        
        // iOS 26 风格：滚动时稍微加深背景
        if (currentScrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.18)';
            nav.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.12)';
            nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    // 移动端菜单切换（预留功能）
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // 可以在这里添加移动端菜单展开逻辑
            console.log('Menu toggle clicked');
        });
    }
}

/**
 * 滚动显示动画
 * 元素进入视口时淡入显示
 */
function initScrollAnimations() {
    // 为需要动画的元素添加 fade-in 类
    const animateElements = document.querySelectorAll(
        '.plugin-card, .feature-item, .section-header, .cta-content'
    );
    
    animateElements.forEach((el, index) => {
        el.classList.add('fade-in');
        // 添加交错延迟
        el.style.transitionDelay = `${index * 0.05}s`;
    });

    // 创建 Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 动画完成后取消观察
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));
}

/**
 * 平滑滚动
 * 点击导航链接时平滑滚动到对应区域
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 视差效果
 * Hero 区域的背景渐变随滚动轻微移动
 */
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        // 只在 Hero 区域可见时应用效果
        if (scrollY < heroHeight) {
            const parallaxValue = scrollY * 0.3;
            hero.style.setProperty('--parallax-y', `${parallaxValue}px`);
            
            // 轻微缩放效果
            const scale = 1 + (scrollY / heroHeight) * 0.1;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${parallaxValue * 0.5}px) scale(${Math.min(scale, 1.1)})`;
                heroContent.style.opacity = Math.max(0, 1 - (scrollY / (heroHeight * 0.6)));
            }
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * 插件卡片 3D 倾斜效果
 * 鼠标悬停时卡片跟随鼠标轻微倾斜
 */
document.querySelectorAll('.plugin-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/**
 * 搜索功能（预留）
 */
document.querySelector('.nav-search')?.addEventListener('click', () => {
    // 可以在这里实现搜索功能
    console.log('Search clicked');
});

/**
 * 键盘导航支持
 */
document.addEventListener('keydown', (e) => {
    // ESC 键关闭任何打开的弹窗或菜单
    if (e.key === 'Escape') {
        // 关闭移动端菜单等
    }
    
    // / 键聚焦搜索
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        document.querySelector('.nav-search')?.click();
    }
});

/**
 * 性能优化：防抖函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 性能优化：节流函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 页面加载完成后的额外优化
window.addEventListener('load', () => {
    // 添加页面加载完成类
    document.body.classList.add('page-loaded');
    
    // 预加载关键资源
    preloadCriticalResources();
});

/**
 * 预加载关键资源
 */
function preloadCriticalResources() {
    // 预加载 GitHub 页面（用户可能点击的链接）
    const links = document.querySelectorAll('a[href*="github.com"]');
    links.forEach(link => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
    });
}

// 导出函数供其他模块使用（如果需要）
window.SyPlugins = {
    initNavigation,
    initScrollAnimations,
    initSmoothScroll,
    initParallaxEffect,
    debounce,
    throttle
};
