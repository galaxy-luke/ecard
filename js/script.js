
function downloadImage() {
    // 檢查是否已加載 html2canvas
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas 庫未加載！');
        alert('無法下載圖片，請檢查網絡連接並重試。');
        return;
    }

    // 獲取要轉換為圖片的元素
    const container = document.querySelector(".card-container");
    if (!container) {
        console.error('找不到 .card-container 元素！');
        return;
    }

    // 獲取所有 side_items 元素
    const sideItems = document.querySelectorAll(".side_items");

    // 保存原始顯示狀態
    const originalDisplays = [];

    // 臨時隱藏所有 side_items 元素
    sideItems.forEach(item => {
        originalDisplays.push(item.style.display);
        item.style.display = 'none';
    });

    // 設置 html2canvas 選項
    const options = {
        scale: 2, // 更高的縮放比例以獲得更清晰的圖像
        useCORS: true, // 允許跨域圖片
        backgroundColor: '#ffffff', // 設置背景顏色
        logging: false // 關閉日誌以減少控制台輸出
    };

    // 使用 html2canvas 將元素轉換為畫布
    html2canvas(container, options).then(canvas => {
        // 創建一個臨時鏈接元素來下載圖片
        const link = document.createElement('a');
        // 使用當前日期時間作為檔名的一部分，避免重複
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `business_card_${timestamp}.png`;
        link.download = fileName;
        link.href = canvas.toDataURL('image/png');

        // 模擬點擊以觸發下載
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('圖片已生成並準備下載！');
    }).catch(error => {
        console.error('生成圖片時發生錯誤：', error);
        alert('下載圖片時發生錯誤，請稍後再試。');
    }).finally(() => {
        // 恢復所有 side_items 元素的原始顯示狀態
        sideItems.forEach((item, index) => {
            item.style.display = originalDisplays[index] || '';
        });
    });
}

// 保留現有的 generateQRCode 函數
function generateQRCode() {
    // 獲取當前頁面的完整 URL
    const currentUrl = window.location.href;
    // 根據設備寬度確定 QR 碼尺寸
    var qrSize = window.innerWidth <= 480 ? 100 : 120;


    // 清空容器並生成新的 QR Code
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';

    // 檢查 QRCode 函式庫是否已載入
    if (typeof QRCode === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js';
        script.onload = () => {
            // 當腳本載入後生成 QR Code
            new QRCode(qrcodeContainer, {
                text: currentUrl,
                width: qrSize,
                height: qrSize,
                colorDark: '#2E7D32',
                colorLight: '#eaeaea'
            });
        };
        document.body.appendChild(script);
    } else {
        // 函式庫已載入，直接生成 QR Code
        new QRCode(qrcodeContainer, {
            text: currentUrl,
            width: qrSize,
            height: qrSize, 
            colorDark: '#2E7D32',
            colorLight: '#C8E6C9'
        });
    }
}
 
 
// 頁面加載時生成 QR 碼
document.addEventListener('DOMContentLoaded', function() {
    generateQRCode();

    // 監聽窗口大小變化，重新生成適合大小的 QR 碼
    window.addEventListener('resize', function() {
        generateQRCode();
    });
});
 

// Load QRCode library dynamically
const script = document.createElement('script');
script.src = 'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js'; 
document.body.appendChild(script);


function addToContacts() {
    // 獲取聯絡人資訊
    const name = document.querySelector('.name').textContent.trim();
    const company = document.querySelector('.company').textContent.trim();
    const title = document.querySelector('.title').textContent.trim();
    const department = document.querySelector('.department').textContent.trim();

    // 獲取電話和郵件
    const emailElement = document.querySelector('.contact a');
    const email = emailElement ? emailElement.textContent.trim() : '';

    // 獲取所有電話號碼元素
    const phoneElements = document.querySelectorAll('.contact p');
    let mobile = '';
    let phone = '';

    // 尋找包含手機和電話的段落
    phoneElements.forEach(p => {
        const text = p.textContent.trim();
        if (text.includes('📱')) {
            mobile = text.replace('📱', '').trim();
        } else if (text.includes('📞')) {
            phone = text.replace('📞', '').trim();
        }
    });

    // 獲取地址
    let address = '';
    phoneElements.forEach(p => {
        if (p.textContent.includes('🏢')) {
            address = p.textContent.replace('🏢', '').trim().replace(/"/g, '');
        }
    });

    // 創建 vCard 內容
    const vcard = createVCard(name, company, title, department, email, phone, mobile, address);

    // 創建並觸發下載
    downloadVCard(vcard, name);
}

function createVCard(name, company, title, department, email, phone, mobile, address) {
    // 分割姓名為姓和名
    let firstName = name;
    let lastName = '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
        lastName = nameParts.pop();
        firstName = nameParts.join(' ');
    }

    // 創建 vCard 字符串 (vCard 版本 3.0)
    let vcard = 'BEGIN:VCARD\n';
    vcard += 'VERSION:3.0\n';
    vcard += `N:${lastName};${firstName};;;\n`;
    vcard += `FN:${name}\n`;

    if (company) {
        vcard += `ORG:${company}\n`;
    }

    if (department) {
        vcard += `ORG:${company};${department}\n`;
    }

    if (title) {
        vcard += `TITLE:${title}\n`;
    }

    if (email) {
        vcard += `EMAIL;type=INTERNET;type=WORK:${email}\n`;
    }

    if (phone) {
        vcard += `TEL;type=WORK:${phone}\n`;
    }

    if (mobile) {
        vcard += `TEL;type=CELL:${mobile}\n`;
    }

    if (address) {
        // 簡單格式化地址
        vcard += `ADR;type=WORK:;;${address};;;;\n`;
    }

    // 添加當前網頁 URL 作為聯絡人網站
    vcard += `URL:${window.location.href}\n`;

    // 添加時間戳
    const now = new Date();
    vcard += `REV:${now.toISOString()}\n`;

    vcard += 'END:VCARD';

    return vcard;
}

function downloadVCard(vcard, name) {
    // 創建 Blob 對象
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });

    // 為 iOS 設備做特殊處理
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        // 在 iOS 上，我們需要創建數據 URL
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/\s+/g, '_')}.vcf`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    } else {
        // 對於 Android 和其他設備
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/\s+/g, '_')}.vcf`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 100);
    }
}


function shareLink() {
    // 獲取當前頁面的完整 URL
    const currentUrl = window.location.href;

    // 檢查瀏覽器是否支持 Web Share API
    if (navigator.share) {
        // 使用 Web Share API 分享連結
        navigator.share({
            title: document.title,
            url: currentUrl
        }).then(() => {
            console.log('分享成功！');
        }).catch((error) => {
            console.error('分享失敗:', error);
            // 如果分享失敗，退回到複製連結方法
            copyToClipboard(currentUrl);
        });
    } else {
        // 不支持 Web Share API 的設備，直接複製到剪貼板
        copyToClipboard(currentUrl);
    }
}

function copyToClipboard(text) {
    // 創建臨時輸入框來複製文字
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();

    try {
        // 嘗試複製到剪貼板
        const success = document.execCommand('copy');
        if (success) {
            showToast('連結已複製到剪貼板');
        } else {
            showToast('複製失敗，請手動複製');
            console.error('複製失敗');
        }
    } catch (err) {
        // 使用更現代的 Clipboard API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('連結已複製到剪貼板');
                })
                .catch(err => {
                    showToast('複製失敗，請手動複製');
                    console.error('複製失敗:', err);
                });
        } else {
            showToast('您的瀏覽器不支持自動複製');
            console.error('複製失敗:', err);
        }
    } finally {
        // 移除臨時輸入框
        document.body.removeChild(tempInput);
    }
}

function showToast(message) {
    // 檢查是否已存在 Toast 元素
    let toast = document.getElementById('toast-message');

    if (!toast) {
        // 創建新的 Toast 元素
        toast = document.createElement('div');
        toast.id = 'toast-message';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        toast.style.color = 'white';
        toast.style.padding = '10px 15px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '1000';
        toast.style.transition = 'opacity 0.3s ease';
        document.body.appendChild(toast);
    }

    // 更新訊息並顯示 Toast
    toast.textContent = message;
    toast.style.opacity = '1';

    // 2秒後自動隱藏
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 2000);
}