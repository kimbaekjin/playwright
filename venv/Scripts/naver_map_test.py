from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=False, slow_mo=300)
    context = browser.new_context()
    page = context.new_page()

    page.goto("https://map.naver.com/p/")
    page.wait_for_timeout(5000)  # 초기 로드 대기

    # 1️⃣ 검색창 입력
    search_selector = 'input.input_search'
    page.wait_for_selector(search_selector, timeout=10000)
    search_input = page.locator(search_selector)
    search_input.click()
    search_input.fill("강남역 스타벅스")
    print("✅ 검색어 입력 완료")

    # 2️⃣ 검색 버튼 클릭
    button_selector = 'button.button_search'
    page.wait_for_selector(button_selector, timeout=10000)
    search_button = page.locator(button_selector)
    search_button.click()
    print("✅ 검색 버튼 클릭 완료")

    page.wait_for_timeout(8000)  # 검색 결과 확인용 대기
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
