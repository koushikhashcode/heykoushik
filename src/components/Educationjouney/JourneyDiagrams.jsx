import React from 'react';

export const JourneyDiagram = ({
  type,
  side,
  className = '',
}) => {
  const patternId = `halftone-pattern-${type}-${side}`;

  const renderArtwork = () => {
    switch (type) {
      case 'workspace-ai':
        return (
          <>
            {/* Gold Duotone Echo (Offset print layer) */}
            <g transform="translate(18, 14)" fill="#C4A77F" stroke="#C4A77F" strokeWidth="2" opacity="0.85">
              <rect x="50" y="70" width="220" height="150" />
              <rect x="230" y="90" width="160" height="120" />
              <rect x="140" y="220" width="40" height="40" />
              <rect x="100" y="255" width="120" height="15" />
              <rect x="30" y="270" width="390" height="25" />
              <circle cx="280" cy="50" r="16" />
              <circle cx="350" cy="40" r="14" />
              <circle cx="390" cy="80" r="14" />
              <line x1="280" y1="50" x2="350" y2="40" strokeWidth="4" />
              <line x1="350" y1="40" x2="390" y2="80" strokeWidth="4" />
            </g>

            {/* Main Halftone & Line Art Layer */}
            <g stroke="#ECECED" strokeWidth="2.5" fill="none">
              <rect x="25" y="265" width="400" height="30" fill="#111112" stroke="#ECECED" />
              <rect x="35" y="272" width="380" height="16" fill={`url(#${patternId})`} stroke="#27272A" />

              <rect x="45" y="65" width="220" height="150" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <rect x="45" y="65" width="220" height="24" fill="#000000" stroke="#ECECED" strokeWidth="1.5" />
              <circle cx="58" cy="77" r="4" fill="#C4A77F" stroke="none" />
              <circle cx="70" cy="77" r="4" fill="#838388" stroke="none" />
              <circle cx="82" cy="77" r="4" fill="#ECECED" stroke="none" />
              <text x="100" y="81" fill="#ECECED" fontSize="9" fontFamily="monospace" fontWeight="bold" stroke="none">
                src/ai/agent_runtime.ts
              </text>
              <rect x="55" y="98" width="80" height="6" fill="#C4A77F" stroke="none" />
              <rect x="55" y="110" width="140" height="6" fill={`url(#${patternId})`} stroke="#838388" strokeWidth="0.8" />
              <rect x="70" y="122" width="110" height="6" fill="#ECECED" stroke="none" />
              <rect x="70" y="134" width="135" height="6" fill={`url(#${patternId})`} stroke="#838388" strokeWidth="0.8" />
              <rect x="85" y="146" width="95" height="6" fill="#ECECED" stroke="none" />
              <rect x="55" y="158" width="60" height="6" fill="#C4A77F" stroke="none" />
              
              <rect x="55" y="174" width="195" height="32" fill="#000000" stroke="#27272A" strokeWidth="1" />
              <text x="62" y="188" fill="#C4A77F" fontSize="8" fontFamily="monospace" stroke="none">
                $ pnpm build:engine — SUCCESS
              </text>
              <text x="62" y="198" fill="#838388" fontSize="7" fontFamily="monospace" stroke="none">
                [AI Studio] listening on :3000
              </text>

              <rect x="225" y="85" width="165" height="125" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <rect x="225" y="85" width="165" height="18" fill="#000000" stroke="#ECECED" strokeWidth="1.5" />
              <circle cx="236" cy="94" r="3" fill="#C4A77F" stroke="none" />
              <circle cx="245" cy="94" r="3" fill="#838388" stroke="none" />
              <circle cx="254" cy="94" r="3" fill="#ECECED" stroke="none" />
              <text x="268" y="97" fill="#ECECED" fontSize="8" fontFamily="monospace" fontWeight="bold" stroke="none">
                agent_core.ts
              </text>

              <rect x="235" y="103" width="145" height="97" fill="#0A0A0B" stroke="#27272A" strokeWidth="1" />
              
              <g fill="#838388" fontSize="6.5" fontFamily="monospace" stroke="none" opacity="0.6">
                <text x="240" y="116">01</text>
                <text x="240" y="126">02</text>
                <text x="240" y="136">03</text>
                <text x="240" y="146">04</text>
                <text x="240" y="156">05</text>
                <text x="240" y="166">06</text>
                <text x="240" y="176">07</text>
                <text x="240" y="186">08</text>
                <text x="240" y="194">09</text>
              </g>

              <line x1="251" y1="105" x2="251" y2="198" stroke="#27272A" strokeWidth="1" />

              <g fontSize="6.5" fontFamily="monospace" stroke="none">
                <text x="256" y="116" fill="#838388">// AI Orchestrator</text>
                <text x="256" y="126">
                  <tspan fill="#C4A77F">async function </tspan>
                  <tspan fill="#ECECED">exec(ctx) &#123;</tspan>
                </text>
                <text x="260" y="136">
                  <tspan fill="#C4A77F">const </tspan>
                  <tspan fill="#ECECED">plan = </tspan>
                  <tspan fill="#C4A77F">await </tspan>
                  <tspan fill="#ECECED">ai.decide();</tspan>
                </text>
                <text x="260" y="146">
                  <tspan fill="#C4A77F">if </tspan>
                  <tspan fill="#ECECED">(!plan.ok) </tspan>
                  <tspan fill="#C4A77F">return </tspan>
                  <tspan fill="#ECECED">null;</tspan>
                </text>
                <text x="260" y="156">
                  <tspan fill="#C4A77F">const </tspan>
                  <tspan fill="#ECECED">res = </tspan>
                  <tspan fill="#C4A77F">await </tspan>
                  <tspan fill="#ECECED">stream(&#123;</tspan>
                </text>
                <text x="266" y="166">
                  <tspan fill="#ECECED">model: </tspan>
                  <tspan fill="#C4A77F">"gemini-2.5"</tspan>
                  <tspan fill="#ECECED">,</tspan>
                </text>
                <text x="266" y="176">
                  <tspan fill="#ECECED">tools: [triage, db],</tspan>
                </text>
                <text x="260" y="186">
                  <tspan fill="#ECECED">&#125;); </tspan>
                  <tspan fill="#C4A77F">return </tspan>
                  <tspan fill="#ECECED">res;</tspan>
                </text>
                <text x="256" y="194" fill="#ECECED">&#125;</text>
              </g>

              <rect x="135" y="215" width="40" height="42" fill="#000000" stroke="#ECECED" strokeWidth="2" />
              <polygon points="95,257 215,257 205,247 105,247" fill="#000000" stroke="#ECECED" strokeWidth="2" />

              <circle cx="275" cy="45" r="14" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <circle cx="275" cy="45" r="6" fill="#C4A77F" stroke="none" />
              <circle cx="345" cy="35" r="14" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <circle cx="345" cy="35" r="6" fill="#C4A77F" stroke="none" />
              <circle cx="385" cy="75" r="14" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <circle cx="385" cy="75" r="6" fill="#C4A77F" stroke="none" />
              <line x1="275" y1="45" x2="345" y2="35" stroke="#ECECED" strokeWidth="3" strokeDasharray="4 2" />
              <line x1="345" y1="35" x2="385" y2="75" stroke="#ECECED" strokeWidth="3" strokeDasharray="4 2" />
            </g>
          </>
        );

      case 'micro-clinics':
        return (
          <>
            <g transform="translate(16, 12)" fill="#C4A77F" stroke="#C4A77F" strokeWidth="2" opacity="0.85">
              <rect x="42" y="32" width="168" height="268" rx="20" />
              <rect x="202" y="42" width="228" height="248" rx="14" />
            </g>

            <g stroke="#ECECED" strokeWidth="2" fill="none">
              <rect x="42" y="32" width="168" height="268" rx="20" fill="#0E0E10" stroke="#ECECED" strokeWidth="2.5" />
              <rect x="48" y="38" width="156" height="256" rx="15" fill="#141416" stroke="#27272A" strokeWidth="1" />

              <rect x="100" y="44" width="52" height="9" rx="4.5" fill="#000000" stroke="#27272A" strokeWidth="1" />
              <circle cx="143" cy="48.5" r="2" fill="#C4A77F" stroke="none" />

              <g transform="translate(54, 58)">
                <rect x="0" y="0" width="18" height="18" rx="4" fill="#C4A77F" stroke="none" />
                <path d="M 9,4 L 9,14 M 4,9 L 14,9" stroke="#111112" strokeWidth="2.5" strokeLinecap="round" />
                <text x="23" y="9" fill="#ECECED" fontSize="8" fontFamily="monospace" fontWeight="bold" stroke="none">
                  CLINIC-AI // HUB
                </text>
                <text x="23" y="16" fill="#C4A77F" fontSize="6.5" fontFamily="monospace" stroke="none">
                  ZERO-WAIT QUEUE • LIVE
                </text>
              </g>

              <g transform="translate(54, 84)">
                <rect x="0" y="0" width="144" height="42" rx="6" fill="#1A1A1E" stroke="#27272A" strokeWidth="1" />
                <circle cx="16" cy="16" r="8" fill="#27272A" stroke="#ECECED" strokeWidth="1" />
                <circle cx="16" cy="14" r="3.5" fill="#C4A77F" stroke="none" />
                <path d="M 10,22 C 10,19 22,19 22,22" fill="#C4A77F" stroke="none" />
                
                <text x="30" y="13" fill="#ECECED" fontSize="7.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                  PATIENT: J. DOE (PH-08)
                </text>
                <text x="30" y="21" fill="#838388" fontSize="6" fontFamily="monospace" stroke="none">
                  TRIAGE: CARDIAC &amp; VITALS INTAKE
                </text>
                
                <rect x="8" y="27" width="128" height="11" rx="3" fill="#000000" stroke="#C4A77F" strokeWidth="0.8" />
                <text x="14" y="35" fill="#C4A77F" fontSize="6" fontFamily="monospace" fontWeight="bold" stroke="none">
                  EST. WAIT TIME: 00:00 // INSTANT
                </text>
              </g>

              <g transform="translate(54, 132)">
                <rect x="0" y="0" width="70" height="40" rx="6" fill="#1A1A1E" stroke="#27272A" strokeWidth="1" />
                <text x="6" y="11" fill="#838388" fontSize="6" fontFamily="monospace" stroke="none">HEART RATE</text>
                <text x="6" y="23" fill="#ECECED" fontSize="10" fontFamily="monospace" fontWeight="bold" stroke="none">
                  72 <tspan fontSize="6" fill="#C4A77F">BPM</tspan>
                </text>
                <path d="M 6,32 L 20,32 L 24,26 L 28,37 L 33,28 L 36,32 L 64,32" stroke="#C4A77F" strokeWidth="1.2" fill="none" />

                <rect x="74" y="0" width="70" height="40" rx="6" fill="#1A1A1E" stroke="#27272A" strokeWidth="1" />
                <text x="80" y="11" fill="#838388" fontSize="6" fontFamily="monospace" stroke="none">BLOOD OXYGEN</text>
                <text x="80" y="23" fill="#ECECED" fontSize="10" fontFamily="monospace" fontWeight="bold" stroke="none">
                  99% <tspan fontSize="6" fill="#C4A77F">SPO2</tspan>
                </text>
                <rect x="80" y="29" width="58" height="3" rx="1.5" fill="#27272A" stroke="none" />
                <rect x="80" y="29" width="56" height="3" rx="1.5" fill="#C4A77F" stroke="none" />

                <rect x="0" y="44" width="70" height="34" rx="6" fill="#1A1A1E" stroke="#27272A" strokeWidth="1" />
                <text x="6" y="55" fill="#838388" fontSize="6" fontFamily="monospace" stroke="none">BLOOD PRESSURE</text>
                <text x="6" y="69" fill="#ECECED" fontSize="9.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                  120/80
                </text>

                <rect x="74" y="44" width="70" height="34" rx="6" fill="#1A1A1E" stroke="#27272A" strokeWidth="1" />
                <text x="80" y="55" fill="#838388" fontSize="6" fontFamily="monospace" stroke="none">BODY TEMP</text>
                <text x="80" y="69" fill="#ECECED" fontSize="9.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                  98.6°F
                </text>
              </g>

              <g transform="translate(54, 218)">
                <rect x="0" y="0" width="144" height="24" rx="5" fill="#C4A77F" stroke="none" />
                <text x="18" y="15" fill="#111112" fontSize="7.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                  CONNECT SPECIALIST [LIVE]
                </text>
                <circle cx="132" cy="12" r="4" fill="#111112" stroke="none" />
                <path d="M 130,10 L 134,12 L 130,14" fill="#C4A77F" stroke="none" />
              </g>

              <g transform="translate(54, 248)">
                <rect x="0" y="0" width="144" height="20" rx="4" fill="#1A1A1E" stroke="#27272A" strokeWidth="0.8" />
                <text x="8" y="13" fill="#838388" fontSize="6" fontFamily="monospace" stroke="none">
                  PHARMACY DISPENSER: <tspan fill="#ECECED">BAY #02 READY</tspan>
                </text>
              </g>

              <line x1="98" y1="284" x2="154" y2="284" stroke="#ECECED" strokeWidth="2.5" strokeLinecap="round" />

              <rect x="202" y="42" width="228" height="248" rx="14" fill="#111112" stroke="#ECECED" strokeWidth="2.5" />
              <rect x="208" y="48" width="216" height="236" rx="10" fill="#161619" stroke="#27272A" strokeWidth="1" />

              <rect x="208" y="48" width="216" height="22" rx="10" fill="#000000" stroke="#27272A" strokeWidth="1" />
              <circle cx="219" cy="59" r="3" fill="#C4A77F" stroke="none" />
              <circle cx="227" cy="59" r="3" fill="#838388" stroke="none" />
              <circle cx="235" cy="59" r="3" fill="#ECECED" stroke="none" />
              <text x="246" y="62" fill="#ECECED" fontSize="7.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                tele-specialist.clinic.ai // CONSOLE
              </text>
              <rect x="382" y="53" width="34" height="12" rx="3" fill="#1A1A1E" stroke="#C4A77F" strokeWidth="0.8" />
              <text x="385" y="61" fill="#C4A77F" fontSize="5.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                ● ENCRYPTED
              </text>

              <g transform="translate(216, 76)">
                <rect x="0" y="0" width="200" height="96" rx="6" fill="#0A0A0C" stroke="#27272A" strokeWidth="1" />
                <rect x="4" y="4" width="192" height="88" rx="4" fill={`url(#${patternId})`} stroke="none" />

                <circle cx="60" cy="40" r="16" fill="#111112" stroke="#ECECED" strokeWidth="1.5" />
                <circle cx="60" cy="38" r="7" fill="#C4A77F" stroke="none" />
                <path d="M 46,54 C 46,45 74,45 74,54" fill="#C4A77F" stroke="none" />
                
                <path d="M 54,46 C 54,54 66,54 66,46" stroke="#ECECED" strokeWidth="1.2" fill="none" />
                <circle cx="60" cy="52" r="2" fill="#ECECED" stroke="none" />

                <rect x="10" y="70" width="105" height="16" rx="3" fill="#000000" stroke="#C4A77F" strokeWidth="0.8" />
                <text x="14" y="77" fill="#ECECED" fontSize="6.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                  DR. ARJUN MENON, MD
                </text>
                <text x="14" y="83" fill="#C4A77F" fontSize="5.5" fontFamily="monospace" stroke="none">
                  CARDIOLOGIST // PHARMACY NODE #04
                </text>

                <g transform="translate(125, 12)">
                  <rect x="0" y="0" width="68" height="74" rx="4" fill="#111112" stroke="#27272A" strokeWidth="0.8" />
                  <text x="6" y="10" fill="#838388" fontSize="5.5" fontFamily="monospace" stroke="none">AI TELEMETRY</text>
                  <text x="6" y="18" fill="#C4A77F" fontSize="6.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                    STABLE 98.4%
                  </text>
                  <line x1="8" y1="36" x2="8" y2="24" stroke="#ECECED" strokeWidth="2" />
                  <line x1="14" y1="36" x2="14" y2="20" stroke="#C4A77F" strokeWidth="2" />
                  <line x1="20" y1="36" x2="20" y2="28" stroke="#ECECED" strokeWidth="2" />
                  <line x1="26" y1="36" x2="26" y2="18" stroke="#C4A77F" strokeWidth="2" />
                  <line x1="32" y1="36" x2="32" y2="26" stroke="#ECECED" strokeWidth="2" />
                  <line x1="38" y1="36" x2="38" y2="22" stroke="#C4A77F" strokeWidth="2" />
                  <line x1="44" y1="36" x2="44" y2="30" stroke="#ECECED" strokeWidth="2" />
                  <line x1="50" y1="36" x2="50" y2="25" stroke="#C4A77F" strokeWidth="2" />
                  <line x1="56" y1="36" x2="56" y2="32" stroke="#ECECED" strokeWidth="2" />

                  <rect x="5" y="44" width="58" height="24" rx="2" fill="#000000" stroke="#C4A77F" strokeWidth="0.5" />
                  <text x="8" y="53" fill="#838388" fontSize="5" fontFamily="monospace" stroke="none">AI DIAGNOSIS:</text>
                  <text x="8" y="60" fill="#ECECED" fontSize="5.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                    BENIGN PALPITATION
                  </text>
                  <text x="8" y="66" fill="#C4A77F" fontSize="5" fontFamily="monospace" stroke="none">
                    NO ACUTE ISCHEMIA
                  </text>
                </g>
              </g>

              <g transform="translate(216, 178)">
                <rect x="0" y="0" width="200" height="96" rx="6" fill="#1A1A1E" stroke="#27272A" strokeWidth="1" />
                <rect x="6" y="6" width="16" height="14" rx="2" fill="#C4A77F" stroke="none" />
                <text x="9" y="16" fill="#111112" fontSize="9" fontFamily="monospace" fontWeight="900" stroke="none">
                  Rx
                </text>
                <text x="26" y="13" fill="#ECECED" fontSize="7" fontFamily="monospace" fontWeight="bold" stroke="none">
                  DIGITAL E-PRESCRIPTION #MC-8824
                </text>
                <text x="26" y="19" fill="#838388" fontSize="5.5" fontFamily="monospace" stroke="none">
                  AUTO-ROUTED TO PHARMACY ROBOTIC DISPENSER
                </text>

                <g transform="translate(8, 25)">
                  <rect x="0" y="0" width="184" height="18" rx="3" fill="#111112" stroke="#27272A" strokeWidth="0.8" />
                  <circle cx="10" cy="9" r="4" fill="#C4A77F" stroke="none" />
                  <text x="18" y="10" fill="#ECECED" fontSize="6.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                    METOPROLOL SUCCINATE 25mg
                  </text>
                  <text x="18" y="15" fill="#838388" fontSize="5" fontFamily="monospace" stroke="none">
                    1 TAB DAILY • 30 DAYS • ORAL
                  </text>
                  <text x="145" y="12" fill="#C4A77F" fontSize="6" fontFamily="monospace" fontWeight="bold" stroke="none">
                    DISPENSED
                  </text>
                </g>

                <g transform="translate(8, 47)">
                  <rect x="0" y="0" width="184" height="18" rx="3" fill="#111112" stroke="#27272A" strokeWidth="0.8" />
                  <circle cx="10" cy="9" r="4" fill="#ECECED" stroke="none" />
                  <text x="18" y="10" fill="#ECECED" fontSize="6.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                    MAGNESIUM GLYCINATE 200mg
                  </text>
                  <text x="18" y="15" fill="#838388" fontSize="5" fontFamily="monospace" stroke="none">
                    1 CAP NIGHTLY • 60 DAYS
                  </text>
                  <text x="145" y="12" fill="#C4A77F" fontSize="6" fontFamily="monospace" fontWeight="bold" stroke="none">
                    DISPENSED
                  </text>
                </g>

                <g transform="translate(8, 70)">
                  <line x1="2" y1="2" x2="2" y2="18" stroke="#ECECED" strokeWidth="1.5" />
                  <line x1="6" y1="2" x2="6" y2="18" stroke="#ECECED" strokeWidth="2.5" />
                  <line x1="11" y1="2" x2="11" y2="18" stroke="#ECECED" strokeWidth="1" />
                  <line x1="14" y1="2" x2="14" y2="18" stroke="#ECECED" strokeWidth="2" />
                  <line x1="18" y1="2" x2="18" y2="18" stroke="#ECECED" strokeWidth="1.5" />
                  <line x1="23" y1="2" x2="23" y2="18" stroke="#ECECED" strokeWidth="3" />
                  <line x1="28" y1="2" x2="28" y2="18" stroke="#ECECED" strokeWidth="1" />
                  <line x1="32" y1="2" x2="32" y2="18" stroke="#ECECED" strokeWidth="2" />
                  <line x1="36" y1="2" x2="36" y2="18" stroke="#ECECED" strokeWidth="1" />
                  
                  <text x="44" y="10" fill="#C4A77F" fontSize="6.5" fontFamily="monospace" fontWeight="bold" stroke="none">
                    TOKEN: #ZW-0492 • PICKUP AT LOCKER 02
                  </text>
                  <text x="44" y="16" fill="#838388" fontSize="5" fontFamily="monospace" stroke="none">
                    INSTANT LOCAL PHARMACY DISPENSARY VERIFIED
                  </text>
                </g>
              </g>

              <path
                d="M 198,150 C 190,150 190,90 202,90"
                stroke="#C4A77F"
                strokeWidth="1.5"
                strokeDasharray="3 2"
                fill="none"
              />
            </g>
          </>
        );

      case 'rockfall-mine':
        return (
          <>
            <g transform="translate(16, 12)" fill="#C4A77F" stroke="#C4A77F" strokeWidth="2" opacity="0.85">
              <polygon points="50,265 110,210 185,210 235,145 315,145 365,80 430,80 430,265" />
              <circle cx="390" cy="50" r="22" />
              <rect x="55" y="45" width="165" height="75" />
              <polygon points="215,165 230,155 240,170 225,180" />
              <polygon points="175,195 190,185 200,200 185,210" />
            </g>

            <g stroke="#ECECED" strokeWidth="2.5" fill="none">
              <rect x="35" y="265" width="395" height="25" fill="#111112" stroke="#ECECED" />
              <rect x="45" y="271" width="375" height="13" fill={`url(#${patternId})`} stroke="#27272A" strokeWidth="1" />

              <polygon
                points="50,265 110,210 185,210 235,145 315,145 365,80 430,80 430,265"
                fill="#111112"
                stroke="#ECECED"
                strokeWidth="3"
              />
              <polygon
                points="65,265 118,215 180,215 230,152 310,152 360,90 420,90 420,265"
                fill={`url(#${patternId})`}
                stroke="none"
              />

              <line x1="375" y1="80" x2="390" y2="55" stroke="#ECECED" strokeWidth="2.5" />
              <line x1="405" y1="80" x2="390" y2="55" stroke="#ECECED" strokeWidth="2.5" />
              <circle cx="390" cy="45" r="20" fill="#111112" stroke="#ECECED" strokeWidth="2.5" />
              <circle cx="390" cy="45" r="12" fill="#000000" stroke="#C4A77F" strokeWidth="2" />
              <circle cx="390" cy="45" r="5" fill="#C4A77F" stroke="none" />

              <path d="M 365,35 A 30 30 0 0 0 355,60" stroke="#C4A77F" strokeWidth="2.5" />
              <path d="M 352,25 A 48 48 0 0 0 338,70" stroke="#C4A77F" strokeWidth="2" strokeDasharray="4 3" />

              <polygon
                points="375,50 190,205 240,150"
                fill="#C4A77F"
                opacity="0.15"
                stroke="none"
              />
              <line x1="375" y1="50" x2="190,205" stroke="#C4A77F" strokeWidth="2" strokeDasharray="5 3" />
              <line x1="375" y1="50" x2="240,150" stroke="#C4A77F" strokeWidth="2" strokeDasharray="5 3" />

              <circle cx="215" cy="175" r="18" fill="none" stroke="#C4A77F" strokeWidth="1.5" strokeDasharray="4 2" />
              <circle cx="215" cy="175" r="6" fill="#C4A77F" stroke="#000000" strokeWidth="1.5" />
              <line x1="192" y1="175" x2="238" y2="175" stroke="#C4A77F" strokeWidth="1.5" />
              <line x1="215" y1="152" x2="215" y2="198" stroke="#C4A77F" strokeWidth="1.5" />

              <polygon
                points="210,160 226,150 236,165 220,175"
                fill="#111112"
                stroke="#ECECED"
                strokeWidth="2"
              />
              <polygon
                points="170,192 186,182 196,198 180,208"
                fill="#C4A77F"
                stroke="#ECECED"
                strokeWidth="2"
              />
              <polygon
                points="130,225 144,217 152,230 138,238"
                fill="#111112"
                stroke="#C4A77F"
                strokeWidth="2"
              />
              <path d="M 230,150 Q 200,175 140,230" stroke="#C4A77F" strokeWidth="2" strokeDasharray="4 3" />

              <g transform="translate(50, 40)">
                <rect x="0" y="0" width="170" height="75" fill="#111112" stroke="#ECECED" strokeWidth="2.5" />
                <rect x="0" y="0" width="170" height="20" fill="#000000" stroke="#ECECED" strokeWidth="1.5" />
                <circle cx="12" cy="10" r="3" fill="#C4A77F" stroke="none" />
                <text x="20" y="14" fill="#ECECED" fontSize="8" fontFamily="monospace" fontWeight="bold" stroke="none">
                  SIH // AI SLOPE RADAR
                </text>

                <text x="12" y="38" fill="#C4A77F" fontSize="10" fontFamily="monospace" fontWeight="bold" stroke="none">
                  ROCKFALL PREDICTED
                </text>
                <text x="12" y="52" fill="#ECECED" fontSize="8" fontFamily="monospace" stroke="none">
                  EARLY WARNING: SECTOR 04
                </text>

                <rect x="12" y="58" width="95" height="12" fill="#000000" stroke="#C4A77F" strokeWidth="1" />
                <text x="16" y="67" fill="#C4A77F" fontSize="7" fontFamily="monospace" fontWeight="bold" stroke="none">
                  ACCURACY: 98.4%
                </text>
              </g>
            </g>
          </>
        );

      case 'short-film':
        return (
          <>
            <g transform="translate(18, 14)" fill="#C4A77F" stroke="#C4A77F" strokeWidth="2" opacity="0.85">
              <rect x="90" y="110" width="170" height="110" />
              <circle cx="140" cy="65" r="45" />
              <circle cx="215" cy="65" r="45" />
              <polygon points="260,130 330,100 330,200 260,170" />
              <line x1="175" y1="220" x2="110" y2="280" strokeWidth="12" />
              <line x1="175" y1="220" x2="240" y2="280" strokeWidth="12" />
            </g>

            <g stroke="#ECECED" strokeWidth="2.5" fill="none">
              <line x1="170" y1="220" x2="95" y2="280" stroke="#ECECED" strokeWidth="7" />
              <line x1="170" y1="220" x2="245" y2="280" stroke="#ECECED" strokeWidth="7" />
              <line x1="170" y1="220" x2="170" y2="280" stroke="#ECECED" strokeWidth="7" />

              <rect x="85" y="105" width="170" height="115" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <rect x="95" y="115" width="150" height="95" fill={`url(#${patternId})`} stroke="#27272A" />

              <circle cx="135" cy="60" r="45" fill="#111112" stroke="#ECECED" strokeWidth="4" />
              <circle cx="135" cy="60" r="30" fill={`url(#${patternId})`} stroke="#27272A" />
              <circle cx="135" cy="60" r="10" fill="#C4A77F" stroke="none" />

              <circle cx="210" cy="60" r="45" fill="#111112" stroke="#ECECED" strokeWidth="4" />
              <circle cx="210" cy="60" r="30" fill={`url(#${patternId})`} stroke="#27272A" />
              <circle cx="210" cy="60" r="10" fill="#C4A77F" stroke="none" />

              <polygon points="255,125 325,95 325,195 255,165" fill="#000000" stroke="#ECECED" strokeWidth="2" />
              <circle cx="325" cy="145" r="25" fill="#111112" stroke="#C4A77F" strokeWidth="3" />
              <circle cx="325" cy="145" r="12" fill="#000000" stroke="#ECECED" strokeWidth="2" />

              <g transform="translate(30, 160) rotate(-8)">
                <rect x="0" y="0" width="140" height="90" fill="#000000" stroke="#ECECED" strokeWidth="2" />
                <rect x="0" y="0" width="140" height="24" fill="#111112" stroke="#ECECED" strokeWidth="2" />
                {[15, 45, 75, 105].map((x) => (
                  <polygon key={x} points={`${x},0 ${x + 15},0 ${x},24 ${x - 15},24`} fill="#ECECED" stroke="none" />
                ))}
                <text x="10" y="42" fill="#ECECED" fontSize="8" fontFamily="monospace" fontWeight="bold" stroke="none">
                  PROD: SHORT FILM
                </text>
                <text x="10" y="56" fill="#C4A77F" fontSize="9" fontFamily="monospace" fontWeight="bold" stroke="none">
                  BEST STORY NOMINEE
                </text>
                <text x="10" y="70" fill="#ECECED" fontSize="8" fontFamily="monospace" stroke="none">
                  DIR: KOUSHIK MANDAL
                </text>
                <text x="10" y="82" fill="#838388" fontSize="7" fontFamily="monospace" stroke="none">
                  TAKE: 01 // 24 FPS
                </text>
              </g>

              <circle cx="340" cy="70" r="28" stroke="#C4A77F" strokeWidth="2" strokeDasharray="5 3" fill={`url(#${patternId})`} />
              <text x="323" y="66" fill="#ECECED" fontSize="7" fontFamily="sans-serif" fontWeight="bold" stroke="none">
                BEST
              </text>
              <text x="321" y="76" fill="#C4A77F" fontSize="7" fontFamily="sans-serif" fontWeight="bold" stroke="none">
                STORY
              </text>
            </g>
          </>
        );

      case 'hackathon-trophy':
        return (
          <>
            <g transform="translate(18, 12)" fill="#C4A77F" stroke="#C4A77F" strokeWidth="2" opacity="0.85">
              <path d="M 130,80 Q 130,170 190,190 L 190,220 L 150,250 L 250,250 L 210,220 L 210,190 Q 270,170 270,80 Z" />
              <path d="M 130,100 C 90,100 90,160 135,160" strokeWidth="12" fill="none" />
              <path d="M 270,100 C 310,100 310,160 265,160" strokeWidth="12" fill="none" />
              <rect x="50" y="240" width="100" height="40" />
              <rect x="150" y="210" width="100" height="70" />
              <rect x="250" y="250" width="100" height="30" />
            </g>

            <g stroke="#ECECED" strokeWidth="2.5" fill="none">
              <rect x="30" y="270" width="380" height="25" fill="#111112" stroke="#ECECED" />
              <rect x="40" y="276" width="360" height="14" fill={`url(#${patternId})`} stroke="#27272A" />

              <rect x="145" y="200" width="110" height="75" fill="#111112" stroke="#C4A77F" strokeWidth="3" />
              <rect x="155" y="210" width="90" height="55" fill={`url(#${patternId})`} stroke="#27272A" />
              <text x="185" y="250" fill="#C4A77F" fontSize="36" fontFamily="Anton" fontWeight="bold" stroke="none">
                1
              </text>

              <rect x="55" y="225" width="90" height="50" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <rect x="62" y="232" width="76" height="36" fill={`url(#${patternId})`} stroke="#27272A" />
              <text x="76" y="258" fill="#ECECED" fontSize="10" fontFamily="Oswald" fontWeight="bold" stroke="none">
                FINALIST
              </text>

              <rect x="255" y="235" width="95" height="40" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <rect x="262" y="242" width="81" height="26" fill={`url(#${patternId})`} stroke="#27272A" />
              <text x="268" y="258" fill="#ECECED" fontSize="9" fontFamily="Oswald" fontWeight="bold" stroke="none">
                75.20% ISC
              </text>

              <path
                d="M 140,60 Q 140,150 195,170 L 195,195 L 165,200 L 235,200 L 205,195 L 205,170 Q 260,150 260,60 Z"
                fill="#111112"
                stroke="#ECECED"
                strokeWidth="4"
              />
              <path
                d="M 150,70 Q 150,140 195,155 Q 240,140 240,70 Z"
                fill={`url(#${patternId})`}
                stroke="#C4A77F"
                strokeWidth="2"
              />

              <path d="M 140,80 C 100,80 100,140 145,140" stroke="#ECECED" strokeWidth="8" fill="none" />
              <path d="M 260,80 C 300,80 300,140 255,140" stroke="#ECECED" strokeWidth="8" fill="none" />

              <polygon
                points="200,85 204,97 217,97 207,105 211,117 200,109 189,117 193,105 183,97 196,97"
                fill="#C4A77F"
                stroke="none"
              />

              <rect x="25" y="90" width="110" height="70" fill="#000000" stroke="#ECECED" strokeWidth="2" />
              <rect x="30" y="95" width="100" height="60" fill="#111112" stroke="#27272A" strokeWidth="1" />
              <text x="35" y="110" fill="#ECECED" fontSize="8" fontFamily="monospace" fontWeight="bold" stroke="none">
                &gt; HACKATHON 1.0
              </text>
              <text x="35" y="122" fill="#C4A77F" fontSize="8" fontFamily="monospace" fontWeight="bold" stroke="none">
                + ALGO_PIPELINE
              </text>
              <text x="35" y="134" fill="#ECECED" fontSize="7" fontFamily="monospace" stroke="none">
                TOP FINALIST
              </text>
              <text x="35" y="146" fill="#838388" fontSize="7" fontFamily="monospace" stroke="none">
                BENCH RANK: 01
              </text>
            </g>
          </>
        );

      case 'icse-academics':
        return (
          <>
            <g transform="translate(18, 14)" fill="#C4A77F" stroke="#C4A77F" strokeWidth="2" opacity="0.85">
              <polygon points="120,40 230,40 250,150 175,210 100,150" />
              <rect x="60" y="190" width="280" height="70" />
              <circle cx="310" cy="90" r="35" />
            </g>

            <g stroke="#ECECED" strokeWidth="2.5" fill="none">
              <rect x="30" y="260" width="380" height="28" fill="#111112" stroke="#ECECED" />
              <rect x="40" y="266" width="360" height="16" fill={`url(#${patternId})`} stroke="#27272A" />

              <polygon points="60,200 190,190 190,250 50,260" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <polygon points="70,205 180,198 180,245 60,252" fill={`url(#${patternId})`} stroke="none" />

              <polygon points="190,190 320,200 330,260 190,250" fill="#111112" stroke="#ECECED" strokeWidth="3" />
              <polygon points="200,198 310,205 320,252 200,245" fill={`url(#${patternId})`} stroke="none" />

              <line x1="190" y1="130" x2="150" y2="210" stroke="#ECECED" strokeWidth="5" />
              <line x1="190" y1="130" x2="230" y2="210" stroke="#ECECED" strokeWidth="5" />
              <circle cx="190" cy="130" r="10" fill="#111112" stroke="#ECECED" strokeWidth="2" />
              <circle cx="190" cy="130" r="4" fill="#C4A77F" stroke="none" />

              <polygon
                points="130,45 230,45 245,135 180,185 115,135"
                fill="#111112"
                stroke="#ECECED"
                strokeWidth="4"
              />
              <polygon
                points="140,55 220,55 232,125 180,168 128,125"
                fill={`url(#${patternId})`}
                stroke="#C4A77F"
                strokeWidth="1.5"
              />

              <circle cx="180" cy="100" r="25" fill="#000000" stroke="#ECECED" strokeWidth="2" />
              <circle cx="180" cy="100" r="22" fill="#111112" stroke="#C4A77F" strokeWidth="1.5" />
              <text x="162" y="104" fill="#ECECED" fontSize="10" fontFamily="Anton" fontWeight="bold" stroke="none">
                84.2%
              </text>
              <text x="163" y="128" fill="#C4A77F" fontSize="9" fontFamily="Oswald" fontWeight="bold" stroke="none">
                ICSE '21
              </text>

              <circle cx="310" cy="95" r="32" fill="#111112" stroke="#ECECED" strokeWidth="4" />
              <circle cx="310" cy="95" r="24" fill={`url(#${patternId})`} stroke="#27272A" />
              <polygon points="310,80 314,90 325,90 317,97 320,108 310,102 300,108 303,97 295,90 306,90" fill="#C4A77F" stroke="none" />
              <polygon points="298,120 290,160 305,150 315,160 305,120" fill="#838388" stroke="none" />
              <polygon points="315,120 305,160 320,150 330,160 322,120" fill="#C4A77F" stroke="none" />
            </g>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`diagram-svg-wrapper ${className}`}
      id={`diagram-${type}-${side}`}
    >
      <svg
        viewBox="0 0 460 330"
        className="diagram-svg-artwork"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            width="5"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2.5" cy="2.5" r="1.3" fill="#838388" />
          </pattern>
        </defs>
        {renderArtwork()}
      </svg>
    </div>
  );
};
