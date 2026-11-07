export interface DocHeading {
  id: string;
  text: string;
  depth: number;
}

export interface DocPageItem {
  path: string;
  title: string;
  group: string;
  tab: string;
  toc: DocHeading[];
  contentHtml: string;
}

export interface DocsTab {
  title: string;
  path: string;
  tabId: string;
}

export const DOCS_TABS: DocsTab[] = [
  { title: "Overview", path: "/docs/overview", tabId: "overview" },
  { title: "Architecture", path: "/docs/architecture", tabId: "architecture" },
  { title: "Smart Contracts", path: "/docs/contracts", tabId: "contracts" },
  { title: "Agentic x402", path: "/docs/x402-protocol", tabId: "agentic-x402" },
  { title: "Hardware POS", path: "/docs/hardware-terminal", tabId: "hardware" },
  { title: "API Reference", path: "/docs/api-reference", tabId: "api" },
];

export const DOCS_PAGES: DocPageItem[] = [
  // 1. Overview
  {
    path: "/docs/overview",
    title: "PaidX Protocol Overview",
    group: "Getting Started",
    tab: "overview",
    toc: [
      { id: "executive-summary", text: "Executive Summary", depth: 2 },
      { id: "core-principles", text: "Core Principles & Non-Custody", depth: 2 },
      { id: "system-topology", text: "System Topology & Architecture", depth: 2 },
      { id: "performance-metrics", text: "Performance & Latency", depth: 2 },
      { id: "getting-started-path", text: "Next Steps", depth: 2 },
    ],
    contentHtml: `
      <p>
        <strong>PaidX</strong> is a strictly <strong>non-custodial cryptocurrency retail point-of-sale (POS) protocol</strong> and agentic payments infrastructure. It bridges physical contactless NFC cards, standalone countertop hardware terminals (ESP32 + PN532), AI agents, and Ethereum Sepolia / Base L2 smart accounts for sub-second in-store and autonomous payments.
      </p>

      <div class="docs-alert docs-alert-note">
        <svg class="docs-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div class="docs-alert-body">
          <div class="docs-alert-title">Production Testnet Implementation</div>
          PaidX is live on <strong>Ethereum Sepolia (Chain ID: 11155111)</strong> using Circle Native USDC (<code>0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238</code>), verified smart contracts, and real hardware terminals.
        </div>
      </div>

      <div class="docs-feature-cards-grid">
        <div class="docs-feature-card">
          <div class="dfc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="5" width="20" height="14" rx="2"></rect>
              <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
          </div>
          <div class="dfc-title">1.2s Contactless Tap</div>
          <div class="dfc-desc">Sub-second retail settlement via NFC hardware and optimistic relayer verification.</div>
        </div>
        <div class="docs-feature-card">
          <div class="dfc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="dfc-title">Zero Custody</div>
          <div class="dfc-desc">Direct P2P transfers customer to merchant. PaidX never holds escrow or private keys.</div>
        </div>
        <div class="docs-feature-card">
          <div class="dfc-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1"></path>
              <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4"></path>
              <circle cx="8" cy="12" r="2"></circle>
            </svg>
          </div>
          <div class="dfc-title">ERC-4337 & x402</div>
          <div class="dfc-desc">Account abstraction with daily rolling spending caps and autonomous HTTP 402 AI payments.</div>
        </div>
      </div>

      <h2 id="executive-summary">Executive Summary</h2>
      <p>
        Traditional retail crypto payments have suffered from prohibitive friction: slow block confirmations, complex mobile wallet app switches, manual QR code scanning, and unpredictable gas spikes. PaidX eliminates these obstacles by packaging <strong>ERC-4337 Account Abstraction</strong>, <strong>ERC-7715 Scoped Delegated Permissions</strong>, and <strong>NFC RFID tap-to-pay</strong> into a seamless retail checkout flow.
      </p>
      <p>
        Shoppers tap a standard unprivileged physical card (NTAG215 or Mifare Classic) on an ESP32 countertop terminal. Within <strong>1.2 seconds</strong>, the terminal verifies authorization, executes an on-chain USDC transfer, displays an animated success receipt on an IPS display, and emits an audio confirmation tone.
      </p>

      <h2 id="core-principles">Core Principles & Non-Custody</h2>
      <p>The protocol enforces five architectural non-negotiables:</p>
      <ul>
        <li><strong>Absolute Non-Custody</strong>: PaidX servers, relayers, and smart contracts never hold or custody customer or merchant tokens. Settlement moves atomically from the payer's smart account to the merchant's registered payout address.</li>
        <li><strong>Account Ownership vs. Scoped Delegation</strong>: The user retains 100% ownership of their account via their self-custody wallet (MetaMask). They delegate a bounded rolling spending cap (e.g. $25/day) to PaidX's session relayer for instant terminal authorization.</li>
        <li><strong>Hardware UID Privacy & Anonymity</strong>: Physical NFC cards contain zero private keys. Furthermore, raw card UIDs are never stored in databases or broadcast on-chain. All operations use a cryptographically salted hash: <code>keccak256(rawUid + salt)</code>.</li>
        <li><strong>Gasless Payer Experience</strong>: End-users never purchase or manage ETH/gas tokens. All terminal UserOperations and transaction gas fees are sponsored via ERC-4337 Paymasters.</li>
        <li><strong>Verifiable On-Chain State</strong>: All merchant registrations, card bindings, and transaction settlements occur transparently on Ethereum Sepolia / Base L2.</li>
      </ul>

      <h2 id="system-topology">System Topology & Architecture</h2>
      <p>
        The PaidX architecture bridges four distinct layers: Client & Hardware, Application & API, State & Identity, and On-Chain Settlement.
      </p>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Components</th>
              <th>Role & Responsibilities</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1. Client & Hardware</strong></td>
              <td>ESP32 + PN532 Terminal, NFC Cards, PaidX Console</td>
              <td>Captures contactless card taps, visual UI receipts, web management interface.</td>
            </tr>
            <tr>
              <td><strong>2. Application & API</strong></td>
              <td>Next.js API Engine, Session Relayer (<code>0x08AC...0009</code>)</td>
              <td>Validates card salted hash, checks spending allowances, triggers atomic USDC transfers.</td>
            </tr>
            <tr>
              <td><strong>3. State & Identity</strong></td>
              <td>Supabase PostgreSQL, Auth & Token Hashes</td>
              <td>Tracks registered cards, merchant profiles, live POS transactions, and daily limits.</td>
            </tr>
            <tr>
              <td><strong>4. On-Chain Settlement</strong></td>
              <td>CardRegistry, MerchantRegistry, Circle Native USDC</td>
              <td>Enforces decentralized ownership, merchant legitimacy, and atomic token settlement.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="performance-metrics">Performance & Latency</h2>
      <p>
        Retail checkouts require rapid transaction completion. Benchmarked across Ethereum Sepolia testnet nodes and local hardware terminals:
      </p>
      <ul>
        <li><strong>Card Tap Detection</strong>: ~45ms (PN532 ISO/IEC 14443A anti-collision loop)</li>
        <li><strong>Salted Hash Verification & Limit Check</strong>: ~110ms (Next.js Edge + Supabase RPC)</li>
        <li><strong>On-Chain Relayer Execution</strong>: ~850ms (Optimistic Sepolia mempool inclusion)</li>
        <li><strong>Terminal Display Render & Audio Tone</strong>: ~60ms (ST7789 SPI DMA transfer)</li>
        <li><strong>Total End-to-End Latency</strong>: <strong>1.2 seconds</strong> average</li>
      </ul>

      <h2 id="getting-started-path">Next Steps</h2>
      <p>
        To set up your wallet and experience a live card tap or agentic x402 payment, follow our step-by-step guides:
      </p>
      <ul>
        <li><a href="/docs/quickstart">Quickstart Guide</a> — Connect MetaMask, grab testnet USDC, and simulate a tap in under 5 minutes.</li>
        <li><a href="/docs/architecture">System Architecture</a> — In-depth breakdown of transaction flows, relayer safety, and contract design.</li>
        <li><a href="/docs/x402-protocol">Agentic Payments over x402</a> — Integrate autonomous HTTP 402 micro-transactions into your AI agents.</li>
      </ul>
    `,
  },

  // 2. Quickstart
  {
    path: "/docs/quickstart",
    title: "Quickstart Guide",
    group: "Getting Started",
    tab: "overview",
    toc: [
      { id: "prerequisites", text: "Prerequisites & Network Setup", depth: 2 },
      { id: "faucet-usdc", text: "Step 1: Obtain Circle Sepolia USDC", depth: 2 },
      { id: "console-account", text: "Step 2: Connect to PaidX Console", depth: 2 },
      { id: "register-nfc", text: "Step 3: Register NFC Card & Salted Hash", depth: 2 },
      { id: "spending-allowance", text: "Step 4: Grant Scoped Allowance", depth: 2 },
      { id: "terminal-tap", text: "Step 5: Perform In-Store Tap Checkout", depth: 2 },
    ],
    contentHtml: `
      <p>
        This guide walks you through setting up your wallet, obtaining testnet USDC, registering an NFC card, and executing a contactless retail crypto transaction in under 5 minutes.
      </p>

      <h2 id="prerequisites">Prerequisites & Network Setup</h2>
      <p>Ensure you have:</p>
      <ul>
        <li>A self-custodial browser wallet (MetaMask recommended).</li>
        <li>Connection to the <strong>Ethereum Sepolia Testnet</strong> (Chain ID: <code>11155111</code>).</li>
        <li>A small amount of Sepolia ETH for initial on-chain registration signatures (or test using Paymaster gas sponsorship).</li>
      </ul>

      <div class="docs-base-url-box">
        <div class="dbu-left">
          <span class="dbu-label">Sepolia RPC URL</span>
          <code class="dbu-code">https://ethereum-sepolia-rpc.publicnode.com</code>
        </div>
        <button class="dbu-copy-btn" data-copy-code type="button">Copy RPC</button>
      </div>

      <h2 id="faucet-usdc">Step 1: Obtain Circle Sepolia USDC</h2>
      <p>
        PaidX settles exclusively in <strong>Circle Official Native USDC</strong>. Do not use unverified mock ERC-20 tokens.
      </p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">Sepolia Native USDC Token Address</span>
          <button class="dcb-copy" data-copy-code type="button">Copy Address</button>
        </div>
        <pre><code>0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238</code></pre>
      </div>
      <p>
        Visit Circle's public testnet faucet at <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer">faucet.circle.com</a>, select Ethereum Sepolia, and request 10.00 USDC to your wallet address.
      </p>

      <h2 id="console-account">Step 2: Connect to PaidX Console</h2>
      <p>
        Navigate to the PaidX Console at <a href="https://console.paidx.cc" target="_blank" rel="noopener noreferrer">console.paidx.cc</a>. Click <strong>Connect Wallet</strong> to authenticate your MetaMask account via Supabase Auth Web3 signature.
      </p>

      <h2 id="register-nfc">Step 3: Register NFC Card & Salted Hash</h2>
      <p>
        In the <strong>Cards & Limits</strong> section, click <strong>Issue New Card</strong>. You can enter an NFC UID or use the built-in random hardware card generator.
      </p>
      <div class="docs-alert docs-alert-tip">
        <svg class="docs-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <div class="docs-alert-body">
          <div class="docs-alert-title">Hardware Privacy Protected</div>
          The console immediately hashes your card UID using <code>keccak256(rawUid + salt)</code> before sending it to the <code>CardRegistry.sol</code> smart contract. Raw card UIDs are never stored on-chain.
        </div>
      </div>

      <h2 id="spending-allowance">Step 4: Grant Scoped Allowance</h2>
      <p>
        Configure your rolling daily spending allowance (default: $25.00 USDC). Confirm the ERC-20 approval transaction in MetaMask delegating spending rights to the Session Relayer address:
      </p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">PaidX Session Relayer Address</span>
          <button class="dcb-copy" data-copy-code type="button">Copy Relayer</button>
        </div>
        <pre><code>0x08AC38a8655a8Cb9841582CEa092df0F65fF0009</code></pre>
      </div>

      <h2 id="terminal-tap">Step 5: Perform In-Store Tap Checkout</h2>
      <p>
        You are now ready to checkout! Either tap your physical card on an ESP32 hardware terminal or use the <strong>Virtual POS Terminal</strong> in the Console:
      </p>
      <ol>
        <li>Enter transaction amount (e.g. <code>$3.50 USDC</code>).</li>
        <li>Present your NFC card or select registered virtual card.</li>
        <li>Observe the live transaction hash on Sepolia Etherscan and receipt notification in ~1.2s.</li>
      </ol>
    `,
  },

  // 3. Architecture
  {
    path: "/docs/architecture",
    title: "System Architecture",
    group: "System Architecture",
    tab: "architecture",
    toc: [
      { id: "architectural-layers", text: "The Four Architectural Layers", depth: 2 },
      { id: "transaction-lifecycle", text: "Transaction Settlement Lifecycle", depth: 2 },
      { id: "session-relayer", text: "Backend Session Relayer", depth: 2 },
      { id: "gas-sponsorship", text: "Gas Sponsorship & Paymaster", depth: 2 },
      { id: "deployed-endpoints", text: "Production Testnet Endpoints", depth: 2 },
    ],
    contentHtml: `
      <p>
        The PaidX architecture solves the physical-world retail friction of Web3 payments through a coordinated multi-tier infrastructure. It ensures instantaneous payment authorizations without compromising on non-custodial cryptographic guarantees.
      </p>

      <h2 id="architectural-layers">The Four Architectural Layers</h2>
      <p>The system is cleanly decoupled into four specialized tiers:</p>

      <h3>1. Client & Hardware Layer</h3>
      <ul>
        <li><strong>ESP32-WROOM-32 MCU</strong>: Dual-core 240MHz microcontroller driving the countertop point-of-sale terminal.</li>
        <li><strong>PN532 RFID/NFC Module</strong>: Communicates over 13.56 MHz ISO/IEC 14443A protocol with contactless cards and mobile wallets.</li>
        <li><strong>ST7789 IPS Color Display</strong>: 240x320 resolution screen providing instant visual UI transaction feedback.</li>
        <li><strong>Web Console (Next.js)</strong>: Customer and merchant portal for card issuance, spending cap management, and real-time revenue analytics.</li>
      </ul>

      <h3>2. Application & API Layer (Next.js Edge)</h3>
      <ul>
        <li><strong>Payment Engine (<code>/api/payments</code>)</strong>: Accepts authenticated POS terminal requests, verifies cryptographic salted card hashes against database limits, and orchestrates on-chain settlement.</li>
        <li><strong>Session Relayer Service</strong>: Maintains a high-throughput transaction submission queue, managing Sepolia nonce synchronization and gas fee estimation.</li>
      </ul>

      <h3>3. State & Identity Layer (Supabase PostgreSQL)</h3>
      <ul>
        <li><strong>Profiles & Wallets</strong>: Maps user accounts to smart account addresses, session allowance caps, and rolling daily utilization.</li>
        <li><strong>Card Registry Table</strong>: Stores salted card hashes (<code>keccak256(rawUid + salt)</code>), issuance timestamps, and lifecycle states (<code>active</code>, <code>frozen</code>, <code>revoked</code>).</li>
        <li><strong>Merchant Registry Table</strong>: Stores authorized merchant IDs, store names, and verified payout destination addresses.</li>
      </ul>

      <h3>4. On-Chain Settlement Layer (Ethereum Sepolia 11155111)</h3>
      <ul>
        <li><strong>CardRegistry.sol</strong>: Decentralized on-chain registry tracking card hash ownership and authorized spenders.</li>
        <li><strong>MerchantRegistry.sol</strong>: Smart contract maintaining verified merchant status and whitelisted payout destinations.</li>
        <li><strong>Circle Native USDC (ERC-20)</strong>: Direct P2P transfer destination without intermediate protocol token vaults.</li>
      </ul>

      <h2 id="transaction-lifecycle">Transaction Settlement Lifecycle</h2>
      <p>When a customer taps their card at a merchant terminal, the following sequence occurs:</p>
      <ol>
        <li><strong>Hardware Tap</strong>: PN532 reads card UID over 13.56 MHz RFID. Terminal transmits payload to <code>POST /api/payments</code> with merchant API key and amount.</li>
        <li><strong>Hash Resolution</strong>: API hashes the incoming UID with <code>CARD_UID_SALT</code> and queries Supabase for the associated customer smart account.</li>
        <li><strong>Policy Validation</strong>: System checks:
          <ul>
            <li>Is the card active (not frozen/revoked)?</li>
            <li>Is the requested amount within the user's daily rolling spending cap?</li>
            <li>Does the customer's wallet possess sufficient USDC balance and allowance?</li>
          </ul>
        </li>
        <li><strong>Relayer Execution</strong>: The Session Relayer calls <code>CircleUSDC.transferFrom(customer, merchantPayout, amount)</code>.</li>
        <li><strong>Terminal Acknowledgment</strong>: API returns HTTP 200 with transaction hash. Terminal renders green checkmark animation, vibrates piezo buzzer, and prints receipt data.</li>
      </ol>

      <h2 id="session-relayer">Backend Session Relayer</h2>
      <p>
        The PaidX Session Relayer (<code>0x08AC38a8655a8Cb9841582CEa092df0F65fF0009</code>) acts as an execution proxy. It submits transactions on behalf of the customer, paying all Layer-1/Layer-2 gas fees.
      </p>
      <div class="docs-alert docs-alert-note">
        <svg class="docs-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div class="docs-alert-body">
          <div class="docs-alert-title">Strictly Bound Execution</div>
          The relayer cannot siphon funds arbitrarily. It can only execute transfers up to the customer's approved USDC spending limit, and transfers must settle directly to a registered merchant payout address.
        </div>
      </div>

      <h2 id="gas-sponsorship">Gas Sponsorship & Paymaster</h2>
      <p>
        In an ERC-4337 Account Abstraction configuration, the PaidX Paymaster inspects incoming UserOperations and sponsors 100% of the gas overhead. Retail customers experience identical ergonomics to Apple Pay or Visa contactless cards—zero gas tokens required.
      </p>

      <h2 id="deployed-endpoints">Production Testnet Endpoints</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Contract / Entity</th>
              <th>Network</th>
              <th>Address / Endpoint</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>CardRegistry.sol</strong></td>
              <td>Ethereum Sepolia</td>
              <td><code>0x7cBD8DE77C16Ba79A1fe10E30913517845D68e51</code></td>
            </tr>
            <tr>
              <td><strong>MerchantRegistry.sol</strong></td>
              <td>Ethereum Sepolia</td>
              <td><code>0xb11dAE79F1B187E95CB93655A983D6e86E574145</code></td>
            </tr>
            <tr>
              <td><strong>Circle Native USDC</strong></td>
              <td>Ethereum Sepolia</td>
              <td><code>0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238</code></td>
            </tr>
            <tr>
              <td><strong>Session Relayer EOA</strong></td>
              <td>Ethereum Sepolia</td>
              <td><code>0x08AC38a8655a8Cb9841582CEa092df0F65fF0009</code></td>
            </tr>
            <tr>
              <td><strong>Web Console</strong></td>
              <td>Production Web</td>
              <td><code>https://console.paidx.cc</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  },

  // 4. Account Abstraction
  {
    path: "/docs/account-abstraction",
    title: "Account Abstraction & ERC-7715",
    group: "System Architecture",
    tab: "architecture",
    toc: [
      { id: "erc4337-overview", text: "ERC-4337 Account Abstraction", depth: 2 },
      { id: "erc7715-permissions", text: "ERC-7715 Scoped Permissions", depth: 2 },
      { id: "eip7702-upgrades", text: "EIP-7702 Delegation Upgrades", depth: 2 },
      { id: "daily-allowance-caps", text: "Rolling Daily Spending Caps", depth: 2 },
      { id: "revocation-mechanics", text: "Permission Revocation", depth: 2 },
    ],
    contentHtml: `
      <p>
        Account Abstraction allows PaidX to bridge Web2 physical tap-to-pay ergonomics with decentralized cryptographic custody. Users authorize delegated micro-transactions without signing an interactive prompt for every retail transaction.
      </p>

      <h2 id="erc4337-overview">ERC-4337 Account Abstraction</h2>
      <p>
        Under the ERC-4337 standard, standard Externally Owned Accounts (EOAs) transition into smart contract accounts. This enables:
      </p>
      <ul>
        <li><strong>Gasless Execution</strong>: UserOperations are packaged and sponsored by a Paymaster contract.</li>
        <li><strong>Batch Transactions</strong>: Approvals and transfers can be bundled into a single atomic transaction.</li>
        <li><strong>Modular Validation</strong>: Custom authorization rules can be attached directly to the smart account.</li>
      </ul>

      <h2 id="erc7715-permissions">ERC-7715 Scoped Permissions</h2>
      <p>
        <strong>ERC-7715</strong> (Wallet Permissions Specification) standardizes how smart accounts grant fine-grained permissions to third-party session keys and relayers.
      </p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">ERC-7715 Permission Delegation Payload</span>
          <button class="dcb-copy" data-copy-code type="button">Copy Payload</button>
        </div>
        <pre><code>{
  "permission": "erc20-periodic-transfer",
  "signer": "0x08AC38a8655a8Cb9841582CEa092df0F65fF0009",
  "data": {
    "token": "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    "periodSeconds": 86400,
    "spendingLimit": "25000000",
    "recipientRestriction": "whitelisted-merchants-only"
  }
}</code></pre>
      </div>

      <h2 id="eip7702-upgrades">EIP-7702 Delegation Upgrades</h2>
      <p>
        With <strong>EIP-7702</strong>, standard MetaMask EOAs can temporarily adopt smart contract execution code during a transaction without deploying costly proxy contracts or moving existing assets to a new address. This gives existing MetaMask users instant compatibility with PaidX terminals.
      </p>

      <h2 id="daily-allowance-caps">Rolling Daily Spending Caps</h2>
      <p>
        PaidX tracks spending against a 24-hour sliding window. If a user sets a $25.00 daily limit:
      </p>
      <ul>
        <li>A $5.00 morning coffee tap utilizes $5.00 of the cap ($20.00 remaining).</li>
        <li>A $12.00 lunch tap succeeds ($8.00 remaining).</li>
        <li>A $10.00 evening tap is immediately rejected by the terminal with an <em>Allowance Exceeded</em> error code.</li>
        <li>24 hours after the morning coffee tap, that $5.00 allowance refreshes automatically.</li>
      </ul>

      <h2 id="revocation-mechanics">Permission Revocation</h2>
      <p>
        Users can instantly revoke the session relayer's delegation at any time via the PaidX Console or directly on-chain. Once revoked, the relayer cannot execute transfers regardless of physical card taps.
      </p>
    `,
  },

  // 5. Security & Cryptography
  {
    path: "/docs/security",
    title: "Security & Cryptography",
    group: "System Architecture",
    tab: "architecture",
    toc: [
      { id: "zero-custody-guarantee", text: "Zero-Custody Architectural Invariants", depth: 2 },
      { id: "card-uid-hashing", text: "Cryptographic Salted Card UID Hashing", depth: 2 },
      { id: "key-custody-matrix", text: "Key Custody & Trust Boundaries", depth: 2 },
      { id: "threat-model", text: "Threat Modeling & Mitigations", depth: 2 },
      { id: "smart-contract-safety", text: "Smart Contract Invariants", depth: 2 },
    ],
    contentHtml: `
      <p>
        Security is the foundational pillar of PaidX. The system is designed under a <strong>zero-trust security model</strong> where no single component—neither the hardware terminal, nor the backend server, nor the session relayer—possesses the capability to seize user funds.
      </p>

      <h2 id="zero-custody-guarantee">Zero-Custody Architectural Invariants</h2>
      <p>
        Under no circumstances do customer or merchant funds pass through a PaidX escrow vault. All transactions are atomic transfers directly between payer and payee:
      </p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">Atomic Transfer Invariant</span>
        </div>
        <pre><code>USDC.transferFrom(customerAccount, merchantPayoutAddress, amount);</code></pre>
      </div>

      <h2 id="card-uid-hashing">Cryptographic Salted Card UID Hashing</h2>
      <p>
        Physical NFC cards (NTAG215 / Mifare) broadcast an unencrypted factory hardware UID over the RFID air interface. Storing or transmitting raw UIDs would create serious tracking vulnerabilities.
      </p>
      <p>
        To prevent surveillance or replay, PaidX derives a pseudonymous 32-byte hash using an on-server secret salt:
      </p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">Salted Hash Derivation</span>
        </div>
        <pre><code>bytes32 cardHash = keccak256(abi.encodePacked(rawCardUid, CARD_UID_SALT));</code></pre>
      </div>
      <p>
        Only this salted hash is recorded in <code>CardRegistry.sol</code> and Supabase. Even if an attacker reads a card's RFID UID with an NFC scanner, they cannot compute the <code>cardHash</code> without knowing the secret salt.
      </p>

      <h2 id="key-custody-matrix">Key Custody & Trust Boundaries</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Entity</th>
              <th>Key Storage Location</th>
              <th>Permissions & Scope</th>
              <th>Blast Radius if Compromised</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Customer Wallet</strong></td>
              <td>MetaMask (Browser / Mobile Secure Enclave)</td>
              <td>Full account ownership, fund withdrawals, contract upgrades.</td>
              <td>Private keys never leave user's device. No access by PaidX.</td>
            </tr>
            <tr>
              <td><strong>Session Relayer</strong></td>
              <td>Secure Server Key Management Service</td>
              <td>Submit gasless transfers up to customer daily cap.</td>
              <td>Cannot withdraw to arbitrary accounts; restricted to registered merchants.</td>
            </tr>
            <tr>
              <td><strong>ESP32 Terminal</strong></td>
              <td>Flash Memory (NVS encrypted)</td>
              <td>Read NFC UID and transmit to merchant API.</td>
              <td>Zero private keys stored on terminal. Hardware theft yields no keys.</td>
            </tr>
            <tr>
              <td><strong>Merchant Payout</strong></td>
              <td>Self-custodial merchant cold/hot wallet</td>
              <td>Receive on-chain USDC settlements.</td>
              <td>Only receives inbound funds. Cannot initiate charges.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="threat-model">Threat Modeling & Mitigations</h2>
      <h3>1. Stolen or Lost NFC Card</h3>
      <p>
        Because physical cards contain zero private keys, a lost card cannot be drained indefinitely. The customer's exposure is strictly capped at their configured daily limit (e.g. $25.00). Furthermore, the user can <strong>instantly freeze</strong> the card with one click in the PaidX Console.
      </p>

      <h3>2. Malicious Merchant Terminal</h3>
      <p>
        Terminals cannot submit arbitrary charge amounts. When an API payment request is received, the backend verifies that the merchant is officially approved in <code>MerchantRegistry.sol</code> and that the amount is under the daily cap.
      </p>

      <h2 id="smart-contract-safety">Smart Contract Invariants</h2>
      <ul>
        <li><strong>OpenZeppelin v5.x</strong>: Standardized, audited base contracts.</li>
        <li><strong>Ownable2Step</strong>: Prevents accidental loss of contract administrative control.</li>
        <li><strong>No Reentrancy</strong>: Follows Checks-Effects-Interactions pattern for all state mutations.</li>
      </ul>
    `,
  },

  // 6. x402 Protocol & Agentic Payments
  {
    path: "/docs/x402-protocol",
    title: "Agentic Payments over x402",
    group: "Agentic Payments",
    tab: "agentic-x402",
    toc: [
      { id: "x402-overview", text: "What is x402 Protocol?", depth: 2 },
      { id: "protocol-handshake", text: "The HTTP 402 Handshake Lifecycle", depth: 2 },
      { id: "header-specification", text: "x402 Header Specifications", depth: 2 },
      { id: "agent-spending-policies", text: "Policy-Based Agent Spending Limits", depth: 2 },
      { id: "code-examples", text: "Agent Implementation Examples", depth: 2 },
    ],
    contentHtml: `
      <p>
        The <strong>x402 protocol</strong> breathes life into the native, long-reserved <strong>HTTP 402 Payment Required</strong> status code. PaidX implements x402 to enable autonomous AI agents to discover, negotiate, and pay for APIs, computational services, and digital resources without human intervention.
      </p>

      <div class="docs-alert docs-alert-note">
        <svg class="docs-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <div class="docs-alert-body">
          <div class="docs-alert-title">Core Web3 Feature of PaidX</div>
          PaidX enables AI agents to autonomously execute micro-payments over HTTP using on-chain settlement, scoped daily limits, and decentralized authorization.
        </div>
      </div>

      <h2 id="x402-overview">What is x402 Protocol?</h2>
      <p>
        AI agents interacting with APIs frequently hit paywalls or require subscription credits. Traditional payment flows (credit card checkout forms, Captchas, 3D Secure SMS codes) are completely impassable for autonomous software agents.
      </p>
      <p>
        The x402 standard solves this by standardizing programmatic payment negotiation over HTTP headers:
      </p>
      <ol>
        <li>An AI agent requests a protected endpoint.</li>
        <li>The server responds with <code>402 Payment Required</code> containing settlement parameters in HTTP response headers.</li>
        <li>The agent verifies its local spending policy, issues an on-chain payment or cryptographic authorization, and retries the request with an <code>X-PAYMENT</code> header.</li>
        <li>The server verifies payment on-chain and returns the resource.</li>
      </ol>

      <h2 id="protocol-handshake">The HTTP 402 Handshake Lifecycle</h2>
      <p>The handshake executes in 4 simple stages:</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Step</th>
              <th>Sender</th>
              <th>Action / Status Code</th>
              <th>Payload Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>AI Agent</td>
              <td><code>GET /api/agent/compute</code></td>
              <td>Initial probe for protected resource.</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Resource Server</td>
              <td><code>HTTP 402 Payment Required</code></td>
              <td>Returns <code>X-Payment-Address</code>, <code>X-Payment-Amount</code>, <code>X-Payment-Token</code>.</td>
            </tr>
            <tr>
              <td>3</td>
              <td>AI Agent</td>
              <td>Policy Check & Execution</td>
              <td>Agent verifies amount against rolling allowance, executes USDC transfer on Sepolia.</td>
            </tr>
            <tr>
              <td>4</td>
              <td>AI Agent</td>
              <td><code>GET /api/agent/compute</code></td>
              <td>Sends request with <code>X-PAYMENT: &lt;txHash&gt;</code> header. Server returns HTTP 200.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="header-specification">x402 Header Specifications</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Header</th>
              <th>Direction</th>
              <th>Description</th>
              <th>Example Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>X-Payment-Required</code></td>
              <td>Server &rarr; Agent</td>
              <td>Protocol version and payment schema.</td>
              <td><code>x402-v1</code></td>
            </tr>
            <tr>
              <td><code>X-Payment-Address</code></td>
              <td>Server &rarr; Agent</td>
              <td>Merchant settlement recipient address.</td>
              <td><code>0x7B52084bC9646b5aAb792E5E6D012B9D90e994F6</code></td>
            </tr>
            <tr>
              <td><code>X-Payment-Amount</code></td>
              <td>Server &rarr; Agent</td>
              <td>Required token amount in human units.</td>
              <td><code>0.25</code></td>
            </tr>
            <tr>
              <td><code>X-Payment-Token</code></td>
              <td>Server &rarr; Agent</td>
              <td>Settlement ERC-20 contract address.</td>
              <td><code>0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238</code></td>
            </tr>
            <tr>
              <td><code>X-Payment-Chain-Id</code></td>
              <td>Server &rarr; Agent</td>
              <td>Network chain identifier.</td>
              <td><code>11155111</code> (Sepolia) or <code>8453</code> (Base)</td>
            </tr>
            <tr>
              <td><code>X-PAYMENT</code></td>
              <td>Agent &rarr; Server</td>
              <td>On-chain transaction hash or signed delegation.</td>
              <td><code>0xa84f128e...39f1</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="agent-spending-policies">Policy-Based Agent Spending Limits</h2>
      <p>
        AI agents must never be granted unconstrained spending authority. PaidX enables developers to configure:
      </p>
      <ul>
        <li><strong>Max Per-Call Budget</strong>: e.g. Maximum $0.50 USDC per individual HTTP request.</li>
        <li><strong>Daily Cumulative Cap</strong>: e.g. Maximum $10.00 USDC per 24-hour cycle.</li>
        <li><strong>Domain & Merchant Whitelist</strong>: Only authorized API hostnames can trigger payment settlements.</li>
      </ul>

      <h2 id="code-examples">Agent Implementation Examples</h2>
      <h3>Python (Requests + Web3.py)</h3>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">agent_x402_client.py</span>
          <button class="dcb-copy" data-copy-code type="button">Copy Code</button>
        </div>
        <pre><code>import requests
from web3 import Web3

def call_x402_resource(url, agent_wallet):
    # 1. Probe endpoint
    resp = requests.get(url)
    if resp.status_code != 402:
        return resp.json()

    # 2. Extract payment requirement
    recipient = resp.headers.get("X-Payment-Address")
    amount_usdc = float(resp.headers.get("X-Payment-Amount"))
    
    # 3. Policy validation
    if amount_usdc > 1.00:
        raise ValueError("Price exceeds agent budget allowance")

    # 4. Settle on-chain via PaidX relayer or smart account
    tx_hash = agent_wallet.transfer_usdc(recipient, amount_usdc)

    # 5. Re-query with payment receipt
    auth_resp = requests.get(url, headers={"X-PAYMENT": tx_hash})
    return auth_resp.json()</code></pre>
      </div>
    `,
  },

  // 7. Smart Contracts
  {
    path: "/docs/contracts",
    title: "Smart Contract Specifications",
    group: "Smart Contracts",
    tab: "contracts",
    toc: [
      { id: "contract-directory", text: "Contract Directory & Sepolia Addresses", depth: 2 },
      { id: "card-registry", text: "CardRegistry.sol", depth: 2 },
      { id: "merchant-registry", text: "MerchantRegistry.sol", depth: 2 },
      { id: "circle-usdc", text: "Circle Native USDC Interface", depth: 2 },
      { id: "events-errors", text: "Events & Custom Error Reference", depth: 2 },
      { id: "foundry-testing", text: "Foundry Verification & Testing", depth: 2 },
    ],
    contentHtml: `
      <p>
        The PaidX smart contract suite is deployed on <strong>Ethereum Sepolia Testnet</strong>. Built with Solidity <code>^0.8.28</code>, Foundry, and OpenZeppelin Contracts v5.x.
      </p>

      <h2 id="contract-directory">Contract Directory & Sepolia Addresses</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Contract</th>
              <th>Sepolia Address</th>
              <th>Owner Address</th>
              <th>Compiler</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>CardRegistry.sol</code></td>
              <td><code>0x7cBD8DE77C16Ba79A1fe10E30913517845D68e51</code></td>
              <td><code>0xA2e3A301159beA4429c56417aB0856a3f4569efa</code></td>
              <td>Solidity 0.8.28</td>
            </tr>
            <tr>
              <td><code>MerchantRegistry.sol</code></td>
              <td><code>0xb11dAE79F1B187E95CB93655A983D6e86E574145</code></td>
              <td><code>0xA2e3A301159beA4429c56417aB0856a3f4569efa</code></td>
              <td>Solidity 0.8.28</td>
            </tr>
            <tr>
              <td><code>Circle Native USDC</code></td>
              <td><code>0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238</code></td>
              <td>Circle Governance</td>
              <td>FiatTokenV2_2</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="card-registry">CardRegistry.sol</h2>
      <p>
        Tracks NFC card ownership, lifecycle states, and binding to user Smart Accounts.
      </p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">CardRegistry Interface Snippet</span>
          <button class="dcb-copy" data-copy-code type="button">Copy Solidity</button>
        </div>
        <pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CardRegistry {
    enum CardStatus { Pending, Active, Frozen, Revoked }

    struct CardRecord {
        address owner;         // Smart account of the card holder
        CardStatus status;     // Active lifecycle state
        uint64 registeredAt;   // Unix registration timestamp
        uint64 statusUpdatedAt;
    }

    mapping(bytes32 => CardRecord) public cards;

    event CardRegistered(bytes32 indexed cardHash, address indexed owner, uint64 timestamp);
    event CardStatusUpdated(bytes32 indexed cardHash, CardStatus previousStatus, CardStatus newStatus);

    function registerCard(bytes32 cardHash, address owner) external;
    function setCardStatus(bytes32 cardHash, CardStatus newStatus) external;
    function verifyCardActive(bytes32 cardHash) external view returns (bool isActive, address owner);
}</code></pre>
      </div>

      <h2 id="merchant-registry">MerchantRegistry.sol</h2>
      <p>
        Maintains on-chain merchant verification and payout address routing to prevent terminal spoofing.
      </p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">MerchantRegistry Interface Snippet</span>
          <button class="dcb-copy" data-copy-code type="button">Copy Solidity</button>
        </div>
        <pre><code>contract MerchantRegistry {
    enum MerchantStatus { Pending, Active, Suspended }

    struct Merchant {
        address payoutAddress;
        MerchantStatus status;
        string businessName;
    }

    mapping(bytes32 => Merchant) public merchants;

    function registerMerchant(bytes32 merchantId, address payout, string calldata name) external;
    function isMerchantActive(bytes32 merchantId) external view returns (bool, address);
}</code></pre>
      </div>

      <h2 id="circle-usdc">Circle Native USDC Interface</h2>
      <p>
        PaidX settles exclusively in Circle Native USDC with 6 decimal places (<code>1 USDC = 1,000,000 units</code>).
      </p>

      <h2 id="events-errors">Events & Custom Error Reference</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Error Selector</th>
              <th>Description</th>
              <th>Resolution</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>CardAlreadyRegistered(bytes32)</code></td>
              <td>Card salted hash is already mapped to an active owner.</td>
              <td>Ensure the card has not been previously enrolled.</td>
            </tr>
            <tr>
              <td><code>UnauthorizedCaller()</code></td>
              <td>Caller is not the card owner or authorized relayer.</td>
              <td>Sign using the registered smart account.</td>
            </tr>
            <tr>
              <td><code>CardNotActive(bytes32)</code></td>
              <td>Card is in Frozen or Revoked status.</td>
              <td>Unfreeze card via PaidX Console.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="foundry-testing">Foundry Verification & Testing</h2>
      <p>Run testnet smoke tests and contract verification using Foundry:</p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">Foundry Test Command</span>
          <button class="dcb-copy" data-copy-code type="button">Copy Command</button>
        </div>
        <pre><code>forge test --fork-url https://ethereum-sepolia-rpc.publicnode.com -vvv</code></pre>
      </div>
    `,
  },

  // 8. Hardware POS & Terminal
  {
    path: "/docs/hardware-terminal",
    title: "Hardware Terminal (ESP32 + PN532)",
    group: "Hardware & POS",
    tab: "hardware",
    toc: [
      { id: "terminal-specs", text: "Hardware Specifications & BOM", depth: 2 },
      { id: "wiring-pinout", text: "Wiring & Pinout Configuration", depth: 2 },
      { id: "firmware-architecture", text: "Firmware Architecture & FreeRTOS", depth: 2 },
      { id: "nfc-tap-protocol", text: "NFC RFID Tap & APDU Protocol", depth: 2 },
      { id: "virtual-pos", text: "Virtual POS Simulator", depth: 2 },
    ],
    contentHtml: `
      <p>
        The PaidX Countertop Terminal is a purpose-built, standalone point-of-sale hardware unit designed around the <strong>ESP32 microcontroller</strong> and <strong>PN532 NFC reader</strong>. It operates independently over Wi-Fi without requiring a tethered smartphone or PC.
      </p>

      <h2 id="terminal-specs">Hardware Specifications & BOM</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Specification</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>MCU</strong></td>
              <td>ESP32-WROOM-32 (240MHz Dual Core, 520KB SRAM)</td>
              <td>Core processor running FreeRTOS tasks.</td>
            </tr>
            <tr>
              <td><strong>NFC Reader</strong></td>
              <td>NXP PN532 (13.56 MHz RFID, SPI / I2C / HSU)</td>
              <td>Contactless ISO/IEC 14443A card reader.</td>
            </tr>
            <tr>
              <td><strong>Display</strong></td>
              <td>2.4" IPS TFT (ST7789, 240x320 RGB, SPI)</td>
              <td>Renders real-time retail UI and animations.</td>
            </tr>
            <tr>
              <td><strong>Audio</strong></td>
              <td>Passive Piezo Buzzer (PWM driven)</td>
              <td>Emits success and error audio chimes.</td>
            </tr>
            <tr>
              <td><strong>Network</strong></td>
              <td>802.11 b/g/n Wi-Fi + BLE 4.2</td>
              <td>Communicates securely with PaidX REST API.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="wiring-pinout">Wiring & Pinout Configuration</h2>
      <p>Default pin mapping between ESP32, PN532, and ST7789 display:</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              <th>Pin Function</th>
              <th>ESP32 GPIO Pin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PN532 (HSU/UART)</td>
              <td>TXD / RXD</td>
              <td>GPIO 16 (RX2) / GPIO 17 (TX2)</td>
            </tr>
            <tr>
              <td>ST7789 (SPI)</td>
              <td>SCK / MOSI / CS / DC / RST</td>
              <td>GPIO 18 / GPIO 23 / GPIO 5 / GPIO 2 / GPIO 4</td>
            </tr>
            <tr>
              <td>Piezo Buzzer</td>
              <td>PWM Control</td>
              <td>GPIO 25</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="firmware-architecture">Firmware Architecture & FreeRTOS</h2>
      <p>
        The terminal firmware runs four concurrent FreeRTOS tasks to guarantee sub-second responsiveness:
      </p>
      <ul>
        <li><strong>Task 1: NFC Polling Loop (Priority 3)</strong>: Scans for card presence every 20ms using PN532 in-list passive target detection.</li>
        <li><strong>Task 2: Payment Network Client (Priority 2)</strong>: Dispatches HTTPS POST payloads to <code>/api/payments</code> with TLS 1.3 encryption.</li>
        <li><strong>Task 3: Display UI Engine (Priority 1)</strong>: Renders standby price prompts, animated spinner during verification, and success checkmarks.</li>
        <li><strong>Task 4: Wi-Fi Reconnect Watchdog (Priority 0)</strong>: Maintains persistent low-latency Wi-Fi connection.</li>
      </ul>

      <h2 id="nfc-tap-protocol">NFC RFID Tap & APDU Protocol</h2>
      <p>
        Standard contactless cards (NTAG213, NTAG215, NTAG216, Mifare Ultralight) emit their 7-byte serial number (UID) during ISO 14443-3 anti-collision cascade. The terminal captures this UID:
      </p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">Example Captured 7-Byte UID</span>
        </div>
        <pre><code>04:8F:3A:C2:90:71:80</code></pre>
      </div>

      <h2 id="virtual-pos">Virtual POS Simulator</h2>
      <p>
        Don't have hardware on hand? PaidX provides a browser-based <strong>Virtual POS Terminal</strong> inside the Merchant Console at <a href="https://console.paidx.cc" target="_blank" rel="noopener noreferrer">console.paidx.cc</a>. You can enter arbitrary amounts, select registered virtual cards, and observe live on-chain Sepolia settlement.
      </p>
    `,
  },

  // 9. API Reference
  {
    path: "/docs/api-reference",
    title: "REST API & MCP Tools",
    group: "Developer Reference",
    tab: "api",
    toc: [
      { id: "api-overview", text: "API Overview & Base URLs", depth: 2 },
      { id: "endpoint-payments", text: "POST /api/payments (Process Payment)", depth: 2 },
      { id: "endpoint-payment-status", text: "GET /api/payments/:id (Payment Status)", depth: 2 },
      { id: "endpoint-cards", text: "POST /api/cards/register (Card Registration)", depth: 2 },
      { id: "endpoint-card-status", text: "POST /api/cards/status (Update Card State)", depth: 2 },
      { id: "endpoint-waitlist", text: "POST /api/waitlist (Waitlist Signup)", depth: 2 },
      { id: "mcp-tools", text: "Model Context Protocol (MCP) Tools", depth: 2 },
    ],
    contentHtml: `
      <p>
        The PaidX REST API allows terminal manufacturers, merchants, and agentic workflows to interact directly with the PaidX payment engine and state database.
      </p>

      <h2 id="api-overview">API Overview & Base URLs</h2>
      <div class="docs-base-url-box">
        <div class="dbu-left">
          <span class="dbu-label">Base URL (Sepolia Testnet & Prod)</span>
          <code class="dbu-code">https://console.paidx.cc/api</code>
        </div>
        <button class="dbu-copy-btn" data-copy-code type="button">Copy URL</button>
      </div>

      <h2 id="endpoint-payments">POST /api/payments (Process Payment)</h2>
      <p>Executes an atomic retail tap payment or agentic checkout.</p>
      
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">Request Headers & Body</span>
          <button class="dcb-copy" data-copy-code type="button">Copy JSON</button>
        </div>
        <pre><code>POST /api/payments HTTP/1.1
Host: console.paidx.cc
Content-Type: application/json
Authorization: Bearer &lt;MERCHANT_API_KEY&gt;

{
  "merchantId": "0xb11dAE79F1B187E95CB93655A983D6e86E574145",
  "cardUid": "04:8F:3A:C2:90:71:80",
  "amount": "4.50",
  "token": "USDC",
  "terminalId": "term_esp32_01"
}</code></pre>
      </div>

      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">Successful Response (HTTP 200 OK)</span>
        </div>
        <pre><code>{
  "success": true,
  "paymentId": "pay_9f2e810a",
  "status": "confirmed",
  "txHash": "0xa4f82810e82c19a0293810293847291039847210394872910394872109348721",
  "amount": "4.50",
  "token": "USDC",
  "payer": "0x3A2190...8421",
  "merchant": "0x7B5208...94F6",
  "timestamp": 1731002400
}</code></pre>
      </div>

      <h2 id="endpoint-payment-status">GET /api/payments/:id (Payment Status)</h2>
      <p>Retrieves the on-chain confirmation status of a previous payment.</p>

      <h2 id="endpoint-cards">POST /api/cards/register (Card Registration)</h2>
      <p>Associates a new physical card with a customer's smart account.</p>

      <h2 id="endpoint-card-status">POST /api/cards/status (Update Card State)</h2>
      <p>Allows card holders to update status (<code>active</code>, <code>frozen</code>, <code>revoked</code>).</p>

      <h2 id="endpoint-waitlist">POST /api/waitlist (Waitlist Signup)</h2>
      <p>Subscribes early beta testers to the PaidX database.</p>
      <div class="docs-code-block">
        <div class="dcb-header">
          <span class="dcb-title">Waitlist Payload</span>
        </div>
        <pre><code>POST /api/waitlist HTTP/1.1
Content-Type: application/json

{
  "email": "developer@fintech.io"
}</code></pre>
      </div>

      <h2 id="mcp-tools">Model Context Protocol (MCP) Tools</h2>
      <p>
        AI agents connecting via MCP can execute tools such as <code>paidx_query_balance</code>, <code>paidx_pay_merchant</code>, and <code>paidx_verify_card</code> directly from Claude, Gemini, or autonomous sidecars.
      </p>
    `,
  },
];
