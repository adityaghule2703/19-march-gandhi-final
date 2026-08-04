const { chromium } = require('playwright');
const { getOtp } = require('./otpProvider');

class InsurancePanelAutomation {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async connect() {
    const port = this.config.browser.remoteDebuggingPort;
    console.log(`🔗 Connecting to browser on port ${port}...`);
    this.browser = await chromium.connectOverCDP(`http://localhost:${port}`);
    this.context = this.browser.contexts()[0];
    const pages = this.context.pages();
    this.page = pages.length ? pages[0] : await this.context.newPage();
    console.log('  ✅ Connected.');
    return this.page;
  }

  async isLoggedIn() {
    const { page } = this;
    try {
      await page.waitForLoadState('networkidle', { timeout: 5000 });
      const url = page.url();
      console.log(`  🔍 Current URL: ${url}`);
      
      if (url.includes('/dashboard') || url.includes('/policy-issuance') || url.includes('/home')) {
        console.log('  ✅ On dashboard - logged in');
        return true;
      }
      
      // Check for login form
      const hasUsername = await page.locator('input[type="text"], input[name="username"]').count() > 0;
      const hasPassword = await page.locator('input[type="password"]').count() > 0;
      
      if (hasUsername && hasPassword) {
        console.log('  ❌ Login form detected');
        return false;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  async login() {
    const { page, config } = this;
    console.log('📌 Logging in to insurance panel...');
    
    try {
      // Go to login page
      await page.goto(config.insurance.loginUrl, { waitUntil: 'networkidle' });
      console.log(`  🔍 Navigated to: ${page.url()}`);
      await page.waitForTimeout(2000);
      
      // Take screenshot
      await page.screenshot({ path: '01-login-page.png' });
      console.log('  📸 Screenshot: 01-login-page.png');
      
      // Find username field - try ALL possible selectors
      let username = null;
      const usernameSelectors = [
        'input[type="text"]',
        'input[name="username"]',
        'input[name="email"]',
        'input[placeholder*="Username" i]',
        'input[placeholder*="User" i]',
        'input[placeholder*="Email" i]',
        'input[placeholder*="ID" i]',
        '#username',
        '#email',
        '#user',
        '.username',
        '.user-input'
      ];
      
      for (const selector of usernameSelectors) {
        try {
          const el = page.locator(selector).first();
          if (await el.count() > 0) {
            username = el;
            console.log(`  ✅ Found username with: ${selector}`);
            break;
          }
        } catch (e) {}
      }
      
      if (!username) {
        // Try to find ANY visible input
        const inputs = await page.locator('input:visible').all();
        console.log(`  🔍 Found ${inputs.length} visible inputs`);
        for (const input of inputs) {
          const type = await input.getAttribute('type');
          if (type === 'text' || type === 'email' || !type) {
            username = input;
            console.log('  ✅ Using first visible input as username');
            break;
          }
        }
      }
      
      if (!username) {
        console.log('  ❌ No username field found!');
        await page.screenshot({ path: '01-no-username.png' });
        return false;
      }
      
      // Fill username
      await username.fill(config.insurance.username);
      console.log(`  ✅ Filled username: ${config.insurance.username}`);
      
      // Find password
      const password = await page.locator('input[type="password"]').first();
      if (!(await password.count())) {
        console.log('  ❌ No password field found!');
        return false;
      }
      await password.fill(config.insurance.password);
      console.log('  ✅ Filled password');
      
      // Handle "Login As" radio
      if (config.insurance.loginAs) {
        try {
          const radio = page.locator(`label:has-text("${config.insurance.loginAs}"), input[value="${config.insurance.loginAs}"]`).first();
          if (await radio.count()) {
            await radio.click();
            console.log(`  ✅ Selected: ${config.insurance.loginAs}`);
          }
        } catch (e) {}
      }
      
      // Find login button
      let loginBtn = null;
      const buttonSelectors = [
        'button[type="submit"]',
        'button:has-text("LOGIN")',
        'button:has-text("SUBMIT")',
        'button:has-text("Sign In")',
        'button:has-text("Login")',
        'input[type="submit"]',
        '.login-button',
        '#login-btn'
      ];
      
      for (const selector of buttonSelectors) {
        try {
          const el = page.locator(selector).first();
          if (await el.count() > 0) {
            loginBtn = el;
            console.log(`  ✅ Found login button: ${selector}`);
            break;
          }
        } catch (e) {}
      }
      
      if (!loginBtn) {
        // Try to find any button
        const buttons = await page.locator('button:visible').all();
        for (const btn of buttons) {
          const text = await btn.textContent();
          if (text && (text.toUpperCase().includes('LOGIN') || text.toUpperCase().includes('SUBMIT'))) {
            loginBtn = btn;
            console.log(`  ✅ Using button with text: ${text}`);
            break;
          }
        }
      }
      
      if (!loginBtn) {
        console.log('  ❌ No login button found!');
        await page.screenshot({ path: '01-no-login-btn.png' });
        return false;
      }
      
      // Click login
      console.log('  🔘 Clicking login...');
      await loginBtn.click();
      await page.waitForTimeout(3000);
      
      await page.screenshot({ path: '02-after-login.png' });
      console.log('  📸 Screenshot: 02-after-login.png');
      
      // Check for OTP
      const otpField = page.locator('input[placeholder*="OTP" i]');
      if (await otpField.count() > 0) {
        console.log('  🔐 OTP required!');
        console.log('  📱 Please enter OTP in the browser window');
        
        if (config.otp.strategy === 'manual') {
          console.log('  ⏳ Waiting 60 seconds for manual OTP entry...');
          await page.waitForTimeout(60000);
        }
        
        await page.screenshot({ path: '03-after-otp.png' });
      }
      
      // Check if login worked
      const url = page.url();
      console.log(`  🔍 Final URL: ${url}`);
      
      if (url.includes('/login')) {
        console.log('  ❌ Still on login page');
        return false;
      }
      
      console.log('  ✅ Login successful!');
      await page.screenshot({ path: '04-login-success.png' });
      return true;
      
    } catch (error) {
      console.error(`  ❌ Login error: ${error.message}`);
      return false;
    }
  }

  // ... rest of the methods (fillProposalForm, etc)
}

module.exports = InsurancePanelAutomation;
