// 检测操作系统


function getOS(userAgent: string) {
    const osPatterns = [
        { pattern: /windows nt 10/i, name: "Windows 10" },
        { pattern: /windows nt 6.3/i, name: "Windows 8.1" },
        { pattern: /windows nt 6.2/i, name: "Windows 8" },
        { pattern: /windows nt 6.1/i, name: "Windows 7" },
        { pattern: /macintosh|mac os x/i, name: "macOS" },
        { pattern: /linux/i, name: "Linux" },
        { pattern: /android/i, name: "Android" },
        { pattern: /iphone|ipad|ipod/i, name: "iOS" },
    ];

    for (const { pattern, name } of osPatterns) {
        if (pattern.test(userAgent)) {
            return name;
        }
    }
    return "Unknown";
}

// 检测浏览器
function getBrowser(userAgent: string) {
    const browserPatterns = [
        { pattern: /edg/i, name: "Edge" },
        { pattern: /opr|opera/i, name: "Opera" },
        { pattern: /chrome/i, name: "Chrome" },
        { pattern: /firefox/i, name: "Firefox" },
        { pattern: /safari/i, name: "Safari" },
        { pattern: /msie|trident/i, name: "Internet Explorer" },
    ];

    for (const { pattern, name } of browserPatterns) {
        if (pattern.test(userAgent)) {
            return name;
        }
    }
    return "Unknown";
}

// 获取设备类型
function getDeviceType(userAgent: string) {
    if (/mobile/i.test(userAgent)) return "Mobile";
    if (/tablet|ipad/i.test(userAgent)) return "Tablet";
    return "Desktop";
}

// 获取浏览器语言
const browser_language = navigator.language  // 输出例如 "en-US", "zh-CN"

// 获取环境信息
function getEnvInfo() {
    const userAgent = navigator.userAgent;
    return {
        userid: sessionStorage.getItem('userid'),
        os: getOS(userAgent),
        browser: getBrowser(userAgent),
        device_type: getDeviceType(userAgent),
        browser_language
    };
}


export { getEnvInfo };