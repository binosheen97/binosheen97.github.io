/**
 * Feedback Widget
 * Floating feedback button for Free Online Tools
 * Formspree endpoint: https://formspree.io/f/mgogoezr
 */
(function () {
    const FORMSPREE_URL = 'https://formspree.io/f/mgogoezr';

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
        #fb-btn {
            position: fixed;
            right: -42px;
            top: 50%;
            transform: translateY(-50%) rotate(-90deg);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 18px;
            border-radius: 10px 10px 0 0;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
            z-index: 9998;
            transition: right 0.3s ease;
            box-shadow: 0 4px 15px rgba(102,126,234,0.4);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            white-space: nowrap;
        }
        #fb-btn:hover { right: -35px; }

        #fb-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            align-items: center;
            justify-content: center;
        }
        #fb-overlay.open { display: flex; }

        #fb-modal {
            background: white;
            border-radius: 20px;
            padding: 30px;
            width: 90%;
            max-width: 440px;
            box-shadow: 0 25px 80px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            animation: fbSlideIn 0.3s ease;
        }

        @keyframes fbSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        #fb-modal h3 {
            font-size: 20px;
            font-weight: 800;
            color: #333;
            margin-bottom: 5px;
        }

        #fb-modal .fb-subtitle {
            font-size: 13px;
            color: #888;
            margin-bottom: 20px;
        }

        #fb-modal .fb-type-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 18px;
        }

        #fb-modal .fb-type-btn {
            padding: 8px 4px;
            border: 2px solid #e0e0e0;
            background: white;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            color: #555;
        }

        #fb-modal .fb-type-btn span {
            display: block;
            font-size: 18px;
            margin-bottom: 3px;
        }

        #fb-modal .fb-type-btn.selected {
            border-color: #667eea;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        #fb-modal .fb-field {
            margin-bottom: 14px;
        }

        #fb-modal .fb-field label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #555;
            margin-bottom: 6px;
        }

        #fb-modal .fb-field input,
        #fb-modal .fb-field textarea,
        #fb-modal .fb-field select {
            width: 100%;
            padding: 11px 14px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 14px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.3s;
            box-sizing: border-box;
            color: #333;
        }

        #fb-modal .fb-field input:focus,
        #fb-modal .fb-field textarea:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
        }

        #fb-modal .fb-field textarea {
            height: 100px;
            resize: vertical;
        }

        #fb-modal .fb-footer {
            display: flex;
            gap: 10px;
            margin-top: 5px;
        }

        #fb-modal .fb-cancel {
            flex: 1;
            padding: 13px;
            border: 2px solid #e0e0e0;
            background: white;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            color: #555;
            transition: all 0.2s;
        }

        #fb-modal .fb-cancel:hover { background: #f5f5f5; }

        #fb-modal .fb-submit {
            flex: 2;
            padding: 13px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 6px 20px rgba(102,126,234,0.3);
        }

        #fb-modal .fb-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(102,126,234,0.4); }
        #fb-modal .fb-submit:disabled { opacity: 0.6; cursor: wait; transform: none; }

        #fb-modal .fb-success {
            text-align: center;
            padding: 20px 0;
        }

        #fb-modal .fb-success .fb-tick { font-size: 48px; margin-bottom: 12px; }
        #fb-modal .fb-success h4 { font-size: 20px; font-weight: 800; color: #27ae60; margin-bottom: 8px; }
        #fb-modal .fb-success p { font-size: 14px; color: #666; }

        #fb-page-info {
            font-size: 11px;
            color: #aaa;
            margin-bottom: 16px;
            background: #f8f9ff;
            padding: 8px 12px;
            border-radius: 8px;
        }

        @media (max-width: 480px) {
            #fb-modal { padding: 22px 18px; }
            #fb-modal .fb-type-grid { grid-template-columns: repeat(2, 1fr); }
        }
    `;
    document.head.appendChild(style);

    // Create floating button
    const btn = document.createElement('button');
    btn.id = 'fb-btn';
    btn.innerHTML = '💬 Feedback';
    btn.onclick = openWidget;
    document.body.appendChild(btn);

    // Create overlay + modal
    const overlay = document.createElement('div');
    overlay.id = 'fb-overlay';
    overlay.innerHTML = `
        <div id="fb-modal">
            <h3>💬 Send Feedback</h3>
            <p class="fb-subtitle">Report a bug, suggest a feature, or share your thoughts!</p>
            <div id="fb-page-info">📍 Page: <strong>${document.title || window.location.pathname}</strong></div>

            <div class="fb-type-grid">
                <button class="fb-type-btn selected" onclick="fbSelectType(this, 'Bug Report')"><span>🐛</span>Bug</button>
                <button class="fb-type-btn" onclick="fbSelectType(this, 'Feature Request')"><span>💡</span>Idea</button>
                <button class="fb-type-btn" onclick="fbSelectType(this, 'General Feedback')"><span>💬</span>General</button>
                <button class="fb-type-btn" onclick="fbSelectType(this, 'Other')"><span>❓</span>Other</button>
            </div>

            <div class="fb-field">
                <label>Your Message *</label>
                <textarea id="fb-message" placeholder="Describe the issue or suggestion in detail..."></textarea>
            </div>

            <div class="fb-field">
                <label>Your Email (optional — for follow-up)</label>
                <input type="email" id="fb-email" placeholder="your@email.com">
            </div>

            <div class="fb-footer">
                <button class="fb-cancel" onclick="closeFb()">Cancel</button>
                <button class="fb-submit" id="fb-submit-btn" onclick="submitFeedback()">📤 Send Feedback</button>
            </div>
        </div>
    `;
    overlay.onclick = function(e) { if (e.target === overlay) closeFb(); };
    document.body.appendChild(overlay);

    // Expose functions globally
    window.openWidget = function() {
        overlay.classList.add('open');
        document.getElementById('fb-message').focus();
    };

    window.closeFb = function() {
        overlay.classList.remove('open');
        // Reset form after short delay
        setTimeout(resetForm, 300);
    };

    let selectedType = 'Bug Report';

    window.fbSelectType = function(btn, type) {
        document.querySelectorAll('.fb-type-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedType = type;
    };

    window.submitFeedback = async function() {
        const message = document.getElementById('fb-message').value.trim();
        const email = document.getElementById('fb-email').value.trim();

        if (!message) {
            document.getElementById('fb-message').focus();
            document.getElementById('fb-message').style.borderColor = '#e74c3c';
            setTimeout(() => { document.getElementById('fb-message').style.borderColor = '#e0e0e0'; }, 2000);
            return;
        }

        const submitBtn = document.getElementById('fb-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Sending...';

        try {
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    type: selectedType,
                    message: message,
                    email: email || 'Not provided',
                    page: document.title,
                    url: window.location.href,
                    userAgent: navigator.userAgent.substring(0, 100)
                })
            });

            if (response.ok) {
                document.getElementById('fb-modal').innerHTML = `
                    <div class="fb-success">
                        <div class="fb-tick">✅</div>
                        <h4>Thank you!</h4>
                        <p>Your feedback has been received. We'll review it and improve the tool!</p>
                        <button class="fb-submit" style="margin-top:15px; padding:12px 30px; font-size:14px;" onclick="closeFb()">Close</button>
                    </div>
                `;
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.textContent = '📤 Send Feedback';
            alert('Could not send feedback. Please try again or email us directly.');
        }
    };

    function resetForm() {
        // Rebuild modal content
        const modal = document.getElementById('fb-modal');
        if (modal) {
            modal.innerHTML = `
                <h3>💬 Send Feedback</h3>
                <p class="fb-subtitle">Report a bug, suggest a feature, or share your thoughts!</p>
                <div id="fb-page-info">📍 Page: <strong>${document.title || window.location.pathname}</strong></div>
                <div class="fb-type-grid">
                    <button class="fb-type-btn selected" onclick="fbSelectType(this, 'Bug Report')"><span>🐛</span>Bug</button>
                    <button class="fb-type-btn" onclick="fbSelectType(this, 'Feature Request')"><span>💡</span>Idea</button>
                    <button class="fb-type-btn" onclick="fbSelectType(this, 'General Feedback')"><span>💬</span>General</button>
                    <button class="fb-type-btn" onclick="fbSelectType(this, 'Other')"><span>❓</span>Other</button>
                </div>
                <div class="fb-field"><label>Your Message *</label><textarea id="fb-message" placeholder="Describe the issue or suggestion in detail..."></textarea></div>
                <div class="fb-field"><label>Your Email (optional — for follow-up)</label><input type="email" id="fb-email" placeholder="your@email.com"></div>
                <div class="fb-footer">
                    <button class="fb-cancel" onclick="closeFb()">Cancel</button>
                    <button class="fb-submit" id="fb-submit-btn" onclick="submitFeedback()">📤 Send Feedback</button>
                </div>
            `;
            selectedType = 'Bug Report';
        }
    }
})();
