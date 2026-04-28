/* js/main.js */
$(document).ready(function () {
    const select = (DOM) => document.querySelector(DOM);

    // 1. QR Code 彈窗開關
    $('#code-btn').click(function () {
        // 讀取自訂連結，若無值則使用當前頁面網址
        const qrLink = $('#qrLink').val() || window.location.href;
        const qrSize = "200x200";
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}&data=${encodeURIComponent(qrLink)}`;

        // 注入圖片並開啟 Modal
        $('#qrcode-img-container').html(`<img src="${qrApiUrl}" alt="QR Code">`);
        $('#qrcode').addClass('active');
        $('body').addClass('active');
    });

    // 2. 關閉彈窗 (點擊關閉鈕或按鈕)
    $('.modal-close, .btn-outline').click(function () {
        $(this).closest('.popup-mask').removeClass('active');
        $('body').removeClass('active');
    });

    // 點擊遮罩外部也可關閉
    $('.popup-mask').click(function (e) {
        if (e.target === this) {
            $(this).removeClass('active');
            $('body').removeClass('active');
        }
    });

    // 3. 複製功能 (Line ID)
    if ($('.copy').length > 0) {
        $('.copy').on('click', function (e) {
            const range = document.createRange();
            const texts = select('#lineId');
            range.selectNode(texts);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    const originalText = $(this).find('span').text();
                    $(this).find('span').text('(已複製 ID!)').css('color', '#009c44');
                    setTimeout(() => {
                        $(this).find('span').text(originalText).css('color', '#999');
                    }, 2000);
                }
            } catch (err) {
                console.error('Oops, unable to copy', err);
            }
            selection.removeAllRanges();
        });
    }
});

// 4. 分享功能 (全域函數供 HTML 呼叫)
function ShareLink() {
    var shareData = {
        title: '數位名片 - ' + $('#hdnNameCH').val() + ' ' + $('#hdnNameEN').val(),
        text: '這是我的數位名片，歡迎與我聯絡！',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(function () {
                showToast('感謝您的分享！');
            })
            .catch(function (error) {
                if (error.name === 'AbortError') {
                    showToast('已取消分享');
                } else {
                    console.log('分享失敗', error);
                }
            });
    } else {
        // 不支援 Web Share API → 複製連結到剪貼簿
        var tempInput = document.createElement('input');
        tempInput.value = shareData.url;
        document.body.appendChild(tempInput);
        tempInput.select();

        try {
            var successful = document.execCommand('copy');
            showToast(successful ? '已複製連結到剪貼簿！' : '複製失敗，請手動複製網址');
        } catch (err) {
            showToast('複製失敗，請手動複製網址');
        }

        document.body.removeChild(tempInput);
        window.getSelection().removeAllRanges();
    }
}

// Toast 提示
function showToast(message) {
    var existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.75);color:#fff;padding:10px 24px;border-radius:20px;font-size:14px;z-index:9999;white-space:nowrap;';
    document.body.appendChild(toast);

    setTimeout(function () {
        toast.remove();
    }, 2500);
}
