(function(){
    const videoLinkInput = document.getElementById('videoLink');
    const boostTypeSelect = document.getElementById('boostType');
    const sendBtn = document.getElementById('sendBoostBtn');
    const resultPanel = document.getElementById('resultPanel');
    const resultMessageDiv = document.getElementById('resultMessage');

    function simulateBoost(videoUrl, boostType) {
        return new Promise((resolve) => {
            let isValid = false;
            if(videoUrl && videoUrl.trim() !== "") {
                const urlPattern = /(tiktok\.com\/@[\w.]+\/video\/\d+|tiktok\.com\/\@[\w.]+\/video\/\d+|vm\.tiktok\.com\/\w+)/i;
                isValid = urlPattern.test(videoUrl);
            }
            
            setTimeout(() => {
                if(!isValid) {
                    resolve({ success: false, error: "Invalid TikTok link. Please check the URL." });
                    return;
                }
                let boostedAmount = 0;
                if(boostType === 'likes') {
                    boostedAmount = Math.floor(Math.random() * (85 - 18 + 1) + 18);
                } else {
                    boostedAmount = Math.floor(Math.random() * (210 - 45 + 1) + 45);
                }
                resolve({ success: true, amount: boostedAmount, type: boostType });
            }, 800);
        });
    }

    function showResult(success, type, amount = 0, errorMsg = "") {
        resultPanel.style.display = "block";
        if(success) {
            const typeEmoji = type === 'likes' ? '❤️' : '👁️';
            const typeWord = type === 'likes' ? 'Likes' : 'Views';
            resultMessageDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; justify-content: center;">
                  <span style="font-size: 1.6rem;">✅</span>
                  <span>Successfully added <span class="like-count-animation">${amount}</span> ${typeWord} ${typeEmoji}</span>
                  <span>to your video!</span>
                </div>
                <div style="font-size: 0.75rem; margin-top: 6px; color: #b3e4ff;">✨ Engagement boosted ✨</div>
            `;
        } else {
            resultMessageDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                  <span>⚠️</span>
                  <span>${errorMsg || "Something went wrong. Try again!"}</span>
                </div>
            `;
        }
        resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    async function handleSendBoost() {
        let rawLink = videoLinkInput.value.trim();
        if(rawLink === "") {
            showResult(false, null, 0, "Please enter a TikTok video link first.");
            return;
        }
        
        const boostType = boostTypeSelect.value;
        
        const originalBtnText = sendBtn.innerHTML;
        sendBtn.innerHTML = `<span>⏳</span> Processing...`;
        sendBtn.disabled = true;
        
        const result = await simulateBoost(rawLink, boostType);
        
        sendBtn.innerHTML = originalBtnText;
        sendBtn.disabled = false;
        
        if(result.success) {
            showResult(true, result.type, result.amount, "");
        } else {
            showResult(false, null, 0, result.error);
        }
    }
    
    sendBtn.addEventListener('click', handleSendBoost);
    
    videoLinkInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
            e.preventDefault();
            handleSendBoost();
        }
    });
})();
