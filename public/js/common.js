$(function(){
    /* ===============================
        GNB 클릭
    =============================== */
    $('.h-gnb a').on('click', function () {
        $('.h-gnb a').removeClass('active');
        $(this).addClass('active');
    });


    /* ===============================
        탭 클릭 (페이지 전환)
    =============================== */
    $(document).on('click', '.po-tab-item', function (e) {

        if ($(e.target).hasClass('btn-close')) return;

        $('.po-tab-item').removeClass('active');
        $(this).addClass('active');
    });


    /* ===============================
        3) 탭 닫기 (X 버튼)
    =============================== */
    $(document).on('click', '.btn-close', function (e) {
        e.stopPropagation(); 

        const $tab = $(this).closest('.po-tab-item');
        const isActive = $tab.hasClass('active');

        $tab.remove();

        if (isActive) {
            const $next = $('.po-tab-item').first();
            $next.addClass('active');
        }
    });


    /* ===========================================
        LNB 메뉴 클릭 시 탭 자동 생성
    =========================================== */
    $(document).on('click', '.menu-list li a', function(e){
        if ($(e.target).hasClass('btn-star')) return;

        const title = $(this).text().trim(); 

        const $existingTab = $('.po-tab-item').filter(function(){
            return $(this).find('.title').text().trim() === title;
        });

        if ($existingTab.length > 0) {
            $('.po-tab-item').removeClass('active');
            $existingTab.addClass('active');
            return;
        }

        const newTab = `
            <div class="po-tab-item active">
                <span class="title">${title}</span>
                <button class="btn-close"></button>
            </div>
        `;

        $('.po-tab-item').removeClass('active');
        $('.po-tabs-inner').append(newTab);
    });


    /* ===============================
        탭 클릭 시 LNB active 이동
    ================================ */
    $(document).on('click', '.po-tab-item', function(e){
        if ($(e.target).hasClass('btn-close')) return;

        const tabTitle = $(this).find('.title').text().trim();

        $('.po-tab-item').removeClass('active');
        $(this).addClass('active');

        $('.menu-list li').removeClass('active');

        $('.menu-list li').each(function(){
            const menuTitle = $(this).text().trim();
            if (menuTitle === tabTitle) {
                $(this).addClass('active');

                $(this).closest('.menu-section')
                    .addClass('open')
                    .find('.menu-list').show();
            }
        });
    });


    /* ===============================
        즐겨찾기(별) 버튼 토글
    =============================== */
    $(document).on('click', '.btn-star', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).toggleClass('active');
    });


    /* ===============================
        메뉴 탭 전환
        (위임 이벤트로 변경하여 Vue 컴포넌트 마운트 후에도 작동)
    ================================ */
    $(document).on('click', '.menu-tab', function () {

        $('.menu-tab').addClass('active');
        $('.menu-favorite').removeClass('active');

        $('.menu-toggle').show(); 
        $('.menu-section').show();
        $('.menu-section-head').show();
        $('.menu-list').show();
        $('.menu-list li').show();

        $('.menu-section').removeClass('open');
        $('.menu-section .menu-list').hide();

        const $activeMenu = $('.menu-list li.active');
        if ($activeMenu.length) {
            const $section = $activeMenu.closest('.menu-section');
            $section.addClass('open');
            $section.find('.menu-list').show();
        }
    });


    /* ===============================
        즐겨찾기 탭 전환
        (위임 이벤트로 변경하여 Vue 컴포넌트 마운트 후에도 작동)
    =============================== */
    $(document).on('click', '.menu-favorite', function () {

        $('.menu-favorite').addClass('active');
        $('.menu-tab').removeClass('active');

        $('.menu-toggle').hide(); 
        $('.menu-section').hide();
        $('.menu-section-head').hide();
        $('.menu-list').hide();
        $('.menu-list li').hide();

        $('.btn-star.active').each(function () {

            const $li = $(this).closest('li'); 

            $li.show();                           // li 
            $li.closest('.menu-list').show();     // ul 
            $li.closest('.menu-section').show();  // section 
        });
    });


    /* ===============================
        메뉴 항목 클릭 시 active 처리
        (위임 이벤트로 변경하여 Vue 컴포넌트 마운트 후에도 작동)
    =============================== */
    $(document).on('click', '.menu-list li', function(e){

        if($(e.target).hasClass('btn-star')) return;

        $('.menu-list li').removeClass('active');
        $(this).addClass('active');
    });


    /* ===============================
        초기 로드시 active 메뉴만 열린 상태
        (Vue 컴포넌트가 마운트된 후 실행되도록 함수로 분리)
    =============================== */
    function initActiveMenu() {
        const $activeMenu = $('.menu-list li.active');
        if ($activeMenu.length) {

            $('.menu-section').removeClass('open');
            $('.menu-section .menu-list').hide();

            const $section = $activeMenu.closest('.menu-section');
            $section.addClass('open');
            $section.find('.menu-list').show();
        }
    }
    
    // 초기 실행 시도
    initActiveMenu();
    
    // Vue 컴포넌트가 마운트된 후에도 실행할 수 있도록 전역 함수로 등록
    window.initActiveMenu = initActiveMenu;


    /* ===============================
        상위 메뉴 접기 / 펼치기
        (위임 이벤트로 변경하여 Vue 컴포넌트 마운트 후에도 작동)
    =============================== */
    $(document).on('click', '.menu-section-head', function(){
        const $section = $(this).closest('.menu-section');
        const $list = $section.find('.menu-list');

        $list.slideToggle(200);
        $section.toggleClass('open');
    });


    /* ===============================
        전체 접기 / 전체 열기 스위치
        (위임 이벤트로 변경하여 Vue 컴포넌트 마운트 후에도 작동)
    =============================== */
    $(document).on('change', '#toggleAll', function(){

        if ($('.menu-favorite').hasClass('active')) {
            return;
        }

        const $toggleText = $('.toggle-text');

        if (this.checked) {
            $('.menu-section').addClass('open');
            $('.menu-list').slideDown(200);
            $toggleText.text('전체 접기');
        } else {
            $('.menu-section').removeClass('open');
            $('.menu-list').slideUp(200);
            $toggleText.text('전체 열기');
        }
    });


    /* ===============================
        파일 선택
    =============================== */
    const btnFile = document.getElementById('btnFile');
    if (btnFile) {
        btnFile.addEventListener('click', function () {
            const realFile = document.getElementById('realFile');
            if (realFile) realFile.click();
        });
    }

    const realFile = document.getElementById('realFile');
    if (realFile) {
        realFile.addEventListener('change', function () {
            const fileInput = document.getElementById('fileName');
            if (fileInput) fileInput.value = this.files.length > 0 ? this.files[0].name : "";
        });
    }


    /* ===============================
        (1024px 이하) 좌측 사이드메뉴 토글
    =============================== */
    $(document).on("click", "button.btn-sidemenu-toggle", function (e) {
        e.stopPropagation(); 
        $(".sidemenu").toggleClass("collapse");
        // 사이드메뉴 collapse 상태에 따라 body에 클래스 추가/제거
        if ($(".sidemenu").hasClass("collapse")) {
            $("body").addClass("sidemenu-expanded");
        } else {
            $("body").removeClass("sidemenu-expanded");
        }
    });


    /* ===============================
        (1024px 이하) GNB 드롭다운 토글
    =============================== */
    $(document).on("click", ".gnb-btn", function (e) {
        if (window.innerWidth > 1024) return; 

        e.stopPropagation();
        $(".gnb-dropdown").toggleClass("active");
    });


    /* ===============================
        (1024px 이하) GNB 메뉴 클릭 시
    =============================== */
    $(document).on("click", ".gnb-dropdown a", function () {
        $(".gnb-dropdown").removeClass("active"); // GNB 닫기
        $(".sidemenu").addClass("collapse");      // 좌측 메뉴 열기
        $("body").addClass("sidemenu-expanded");  // body에 클래스 추가
    });


    /* ===============================
        사이드메뉴 초기 상태 확인 및 상태 동기화
    =============================== */
    function updateSidemenuState() {
        if (window.innerWidth <= 1024) {
            if ($(".sidemenu").hasClass("collapse")) {
                $("body").addClass("sidemenu-expanded");
            } else {
                $("body").removeClass("sidemenu-expanded");
            }
        } else {
            $("body").removeClass("sidemenu-expanded");
        }
    }

    // 초기 상태 확인
    $(document).ready(function() {
        updateSidemenuState();
    });

    // 사이드메뉴 요소가 동적으로 추가될 경우를 대비한 MutationObserver
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    updateSidemenuState();
                }
            });
        });

        $(document).ready(function() {
            const sidemenu = document.querySelector('.sidemenu');
            if (sidemenu) {
                observer.observe(sidemenu, { attributes: true, attributeFilter: ['class'] });
            }
        });
    }


    /* ===============================
        필터 버튼 클릭 시 옵션
    =============================== */
    $("#btnFilter").on("click", function(e){
        e.stopPropagation();
        const popup = $(this).siblings(".filter-option-popup");

        if (popup.hasClass("open")) {
            popup.removeClass("open").hide();
        } else {
            popup.show(0, function(){
                $(this).addClass("open");
            });
        }
    });

    $(document).on("click", function(e){
        if (!$(e.target).closest(".filter-option-wrap").length) {
            $(".filter-option-popup").removeClass("open").hide();
        }
    });


    /* ===========================================
        매장 선택 팝업
    =========================================== */
    $(document).on("click", ".store-btn-open", function (e) {
        e.stopPropagation();
        const popup = $("#storeSelectPopup");
        const isOpen = popup.is(":visible");
        $(".store-select-popup").hide();
        if (!isOpen) popup.show();
    });

    $(document).on("click", "#storePopupClose", function () {
        $("#storeSelectPopup").hide();
    });


    /* ===========================================
        Input - 숫자만 입력 허용 (js-only-number 클래스 대상)
    =========================================== */
    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('js-only-number')) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        }
    });


    /* ================================
        Modal Popup Control
    ================================ */
    $(document).on('click', '.js-open-menu-modal', function () {
        $('.modal-popup').addClass('is-open');
        $('body').addClass('no-scroll');
    });

    /* X 버튼 닫기 */
    $(document).on('click', '.modal-close', function () {
        closeModal();
    });

    /* dim 클릭 닫기 */
    $(document).on('click', '.modal-dim', function () {
        closeModal();
    });

    /* ESC 닫기 */
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    /* 공통 닫기 함수 */
    function closeModal() {
        $('.modal-popup').removeClass('is-open');
        $('body').removeClass('no-scroll');
    }


    /* ================================
        Sub Layout Tab
    ================================ */
    $(document).on('click', '.sub-layout-tab-item', function () {

        // disabled 탭은 전환 안 함
        if ($(this).hasClass('tab-disabled')) return;

        const target = $(this).data('tab'); 

        $('.sub-layout-tab-item').removeClass('active');
        $(this).addClass('active');

        $('.sub-tab-panel').removeClass('active');
        $('#' + target).addClass('active');
    });


    /* ================================
        Menu Status Bar
    ================================ */
    function updateMenuStatusBar() {
        const checkedCount = $('.js-menu-status-toggle:checked').length;
        $('.menu-status-bar').toggleClass('show', checkedCount > 0);
    }

    /* 개별 메뉴 체크 */
    $(document).on('change', '.js-menu-status-toggle', function () {
        updateMenuStatusBar();

        const total = $('.js-menu-status-toggle').length;
        const checked = $('.js-menu-status-toggle:checked').length;
        $('.js-menu-status-toggle-all').prop('checked', total === checked);
    });

    /* 전체 선택 */
    $(document).on('change', '.js-menu-status-toggle-all', function () {
        const isChecked = $(this).is(':checked');
        $('.js-menu-status-toggle').prop('checked', isChecked);
        updateMenuStatusBar();
    });

    /* 상태 버튼 active */
    $(document).on('click', '.btn-menu-status', function () {
        $('.btn-menu-status').removeClass('active');
        $(this).addClass('active');
    });

    /* 메뉴 상태 바 토글 (기존 파일 로직 유지) */
    $(document).on('change', '.js-toggle-menu-status', function(){
        $('.menu-status-bar').toggleClass('is-open', $(this).is(':checked'));
    });

    /* 저장 버튼 클릭 (기존 파일 로직 유지) */
    $(document).on('click', '.btn-save', function(){
        const status = $('.btn-menu-status.active').data('value');
        console.log(status);
    });


    /* ================================
        비밀번호 보이기/숨기기
    ================================ */
    $(document).on('click', '.js-toggle-password', function(){
        const $input = $(this).siblings('.js-password');

        if($input.attr('type') === 'password'){
            $input.attr('type', 'text');
            $(this).addClass('on');
        } else {
            $input.attr('type', 'password');
            $(this).removeClass('on');
        }
    });


    /* ================================
        페이지 탭 가로 스크롤 (마우스 휠 → 좌우)
    ================================ */
    $('.po-tabs-inner').on('wheel', function(e){
        e.preventDefault();
        this.scrollLeft += e.originalEvent.deltaY;
    });


    /* ================================
        Tab Menu Popup Toggle
    ================================ */
    $(document).on('click', '.btn-action.menu', function(e){
        e.stopPropagation();
        $(this).closest('.btn-menu-group')
            .find('.tab-menu-popup')
            .toggleClass('open');
    });

    $(document).on('click', function(){
        $('.tab-menu-popup').removeClass('open');
    });


    /* ================================
    Global Full Mode Toggle
    ================================ */
    $(document).on('click', '.btn-action.expand', function(){
        $('body').toggleClass('full-mode');
    });

    

});
