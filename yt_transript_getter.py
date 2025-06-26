from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def fetch_transcript(video_url):
    """Fetch transcript from a YouTube page."""
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)

    try:
        driver.get(video_url)
        time.sleep(5)

        # Try direct access first
        elements = driver.find_elements(By.CSS_SELECTOR, "ytd-transcript-segment-renderer")
        if elements:
            print("✅ Found transcript elements directly.")
        else:
            # Try finding and clicking the 'Show transcript' link
            try:
                transcript_button = driver.find_element(By.XPATH, "//span[contains(text(),'Show transcript') or contains(text(),'View transcript')]")
                transcript_button.click()
                time.sleep(3)
            except Exception:
                print("ℹ️ No transcript button found.")
            
            elements = driver.find_elements(By.CSS_SELECTOR, "ytd-transcript-segment-renderer")

        # Extract transcript
        transcript = []
        for elem in elements:
            try:
                t = elem.find_element(By.CSS_SELECTOR, ".segment-timestamp").text.strip()
                txt = elem.find_element(By.CSS_SELECTOR, "yt-formatted-string.segment-text").text.strip()
                transcript.append({"time": t, "text": txt})
            except Exception as e:
                print(f"Warning extracting segment: {e}")

        return transcript

    finally:
        driver.quit()


# TEST
if __name__ == '__main__':
    video_url = "https://www.youtube.com/watch?v=ux8GZAtCN-M"  # <-- Replace
    results = fetch_transcript(video_url)

    if results:
        for item in results:
            print(f"{item['time']} -> {item['text']}")
    else:
        print("❌ No transcript found or transcript unavailable.")
