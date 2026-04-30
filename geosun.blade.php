<!DOCTYPE html>
<html lang="zh-TW">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $identity->seo_title ?? ($company->name . ' - ' . $identity->name . ($identity->english_name ? ' ' . $identity->english_name : '')) }}</title>
    {{-- 引入 Google Fonts --}}
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('templates/geosun/css/style.css') }}">

</head>

<body>

    <div class="card-container">

        {{-- ===== 上段：Header + 大頭照 ===== --}}
        <div class="card-header">
            <div class="header">
                <img src="{{ asset($company->logo_path ?? 'templates/geosun/assets/logo.svg') }}" alt="Logo" class="logo">
            </div>
            <div class="profile-section">
                <div class="profile-pic-wrapper">
                    <img src="{{ $identity->profile_image_path ? asset('storage/' . $identity->profile_image_path) : asset('images/default.png') }}" alt="Profile Picture" class="profile-pic">
                </div>
            </div>
        </div>

        {{-- ===== 中段：個人資訊 + 聯絡清單 ===== --}}
        <main class="card-main">
            <div class="info-section">
                <div class="dept-title">{{ $identity->department }}{{ $identity->position ? ' ' . $identity->position : '' }}</div>
                <h1 class="name">{{ $identity->name }} @if($identity->nickname)<span class="nickname">{{ $identity->nickname }}</span>@endif</h1>
                @if($identity->english_name)
                <div class="english-name">{{ $identity->english_name }}</div>
                @endif
            </div>

            <ul class="contact-list">
                @if($identity->mobile)
                <li>
                    <div class="icon-box"><img src="{{ asset('templates/geosun/assets/phone_icon.png') }}" alt="Phone"></div>
                    <div class="contact-text"><a href="tel:{{ preg_replace('/[^0-9+]/', '', $identity->mobile) }}">{{ $identity->mobile }}</a></div>
                </li>
                @endif
                @if($identity->phone)
                <li>
                    <div class="icon-box"><img src="{{ asset('templates/geosun/assets/tel_icon.png') }}" alt="Tel"></div>
                    <div class="contact-text"><a href="tel:{{ preg_replace('/[^0-9+]/', '', $identity->phone) }}">{{ $identity->phone }}{{ $identity->phone_ext ? ' #' . $identity->phone_ext : '' }}</a></div>
                </li>
                @endif
                @if($identity->email)
                <li>
                    <div class="icon-box"><img src="{{ asset('templates/geosun/assets/mail_icon.png') }}" alt="Email"></div>
                    <div class="contact-text"><a href="mailto:{{ $identity->email }}">{{ $identity->email }}</a></div>
                </li>
                @endif
                @if($identity->address)
                <li>
                    <div class="icon-box"><img src="{{ asset('templates/geosun/assets/add_icon.png') }}" alt="Address"></div>
                    <div class="contact-text">
                        @if($identity->map_url)
                        <a href="{{ $identity->map_url }}" target="_blank" rel="noopener noreferrer">{{ $identity->address }}</a>
                        @else
                        {{ $identity->address }}
                        @endif
                    </div>
                </li>
                @endif
                {{-- Line ID（有值才顯示）--}}
                @if($identity->line_id)
                <li class="copy" style="cursor: pointer;">
                    <div class="icon-box icon-line"><img src="https://img.icons8.com/color/48/000000/line-me.png" alt="Line" style="width: 20px;"></div>
                    <div class="contact-text" id="lineId">{{ $identity->line_id }}</div>
                    <span style="font-size: 10px; color: #999; margin-left: 5px;">(點擊複製 ID)</span>
                </li>
                @endif
                @if($identity->website)
                <li>
                    <div class="icon-box icon-web"><img src="{{ asset('templates/geosun/assets/web_icon.png') }}" alt="Web"></div>
                    <div class="contact-text"><a href="{{ $identity->website }}" target="_blank">{{ $identity->website }}</a></div>
                </li>
                @endif
            </ul>
        </main>

        {{-- ===== 下段：波浪 Footer + 功能按鈕 ===== --}}
        <footer class="card-footer">
            <div class="bottom-bg">
                <img src="{{ asset($company->bottom_wave_path ?? 'templates/geosun/assets/bottom.png') }}" alt="Bottom Wave">
            </div>
            <div class="actions">
                <button id="code-btn" title="QR Code">
                    <img src="{{ asset('templates/geosun/assets/qr_icon.png') }}" alt="QR Code">
                </button>
                <button id="share-btn" onclick="ShareLink()" title="分享連結">
                    <img src="{{ asset('templates/geosun/assets/share_icon.png') }}" alt="Share">
                </button>
            </div>
        </footer>

    </div>

    {{-- QR Code 彈窗 (Modal) --}}
    <div id="qrcode" class="popup-mask">
        <div class="modal">
            <div class="modal-close">×</div>
            <h2>掃描 QR code</h2>
            <div id="qrcode-img-container">
                {{-- 動態注入 QR Code 圖片 --}}
            </div>
            <div class="btn-outline">關閉</div>
        </div>
    </div>

    {{-- 預留隱藏欄位供 JS 抓取名稱 --}}
    <input type="hidden" id="hdnNameCH" value="{{ $identity->name }}">
    <input type="hidden" id="hdnNameEN" value="{{ $identity->english_name ?? '' }}">
    {{-- QR Code 自訂連結 (若無值則使用當前頁面網址) --}}
    <input type="hidden" id="qrLink" value="{{ $identity->qr_link ?? '' }}">

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="{{ asset('templates/geosun/js/main.js') }}"></script>
</body>

</html>
