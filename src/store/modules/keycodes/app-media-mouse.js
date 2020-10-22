export default [
  { label: 'AppMediaMouse', width: 'label', group: true },

  { label: 'Application', width: 'label' },

  { name: 'Power', code: 'KC_PWR', title: 'System Power Down' },
  { name: 'Sleep', code: 'KC_SLEP', title: 'System Sleep' },
  { name: 'Wake', code: 'KC_WAKE', title: 'System Wake' },
  { width: 1250 },
  { name: 'Exec', code: 'KC_EXEC', title: 'Execute' },
  { name: 'Help', code: 'KC_HELP', title: 'Help' },
  { name: 'Menu', code: 'KC_MENU', title: 'Menu' },
  { name: 'Select', code: 'KC_SLCT', title: 'Select' },
  { name: 'Stop', code: 'KC_STOP', title: 'Stop' },
  { name: 'Again', code: 'KC_AGIN', title: 'Again' },
  { name: 'Undo', code: 'KC_UNDO', title: 'Undo' },
  { name: 'Cut', code: 'KC_CUT', title: 'Cut' },
  { name: 'Copy', code: 'KC_COPY', title: 'Copy' },
  { name: 'Paste', code: 'KC_PSTE', title: 'Paste' },
  { name: 'Find', code: 'KC_FIND', title: 'Find' },
  { width: 0 },
  {
    name: '🖩Calc',
    code: 'KC_CALC',
    title: 'Launch Calculator (Windows)'
  },
  {
    name: '📧',
    code: 'KC_MAIL',
    title: 'Launch Mail (Windows)'
  },
  {
    name: '🎵',
    code: 'KC_MSEL',
    title: 'Launch Media Player (Windows)'
  },
  {
    name: '🖥️',
    code: 'KC_MYCM',
    title: 'Launch My Computer (Windows)'
  },
  { width: 250 },
  {
    name: '🌏🔍',
    code: 'KC_WSCH',
    title: 'Browser Search (Windows)',
    width: 1500
  },
  {
    name: '🌏🏠',
    code: 'KC_WHOM',
    title: 'Browser Home (Windows)',
    width: 1500
  },
  {
    name: '🌏←',
    code: 'KC_WBAK',
    title: 'Browser Back (Windows)',
    width: 1500
  },
  {
    name: '🌏→',
    code: 'KC_WFWD',
    title: 'Browser Forward (Windows)',
    width: 1500
  },
  {
    name: '🌏❌',
    code: 'KC_WSTP',
    title: 'Browser Stop (Windows)',
    width: 1500
  },
  {
    name: '🌏🔄',
    code: 'KC_WREF',
    title: 'Browser Refresh (Windows)',
    width: 1500
  },
  {
    name: '🌏❤',
    code: 'KC_WFAV',
    title: 'Browser Favorites (Windows)',
    width: 1500
  },
  // {
  //   name: 'Brightness Up',
  //   code: 'KC_BRIU',
  //   title: 'Increase the brightness of screen (Laptop)',
  //   width: 1500
  // },
  // {
  //   name: 'Brightness Down',
  //   code: 'KC_BRID',
  //   title: 'Decrease the brightness of screen (Laptop)',
  //   width: 1500
  // },

  { label: 'Multimedia Keys', width: 'label' },

  { name: '⏮', code: 'KC_MPRV', title: 'Previous Track' },
  { name: '⏭️', code: 'KC_MNXT', title: 'Next Track' },
  { name: '🔇', code: 'KC_MUTE', title: 'Mute Audio' },
  { name: '🔉', code: 'KC_VOLD', title: 'Volume Down' },
  { name: '🔊', code: 'KC_VOLU', title: 'Volume Up' },
  { name: '⏹', code: 'KC_MSTP', title: 'Media Stop' },
  { name: '▶️', code: 'KC_MPLY', title: 'Play/Pause' },
  { width: 250 },
  {
    name: '⏪',
    code: 'KC_MRWD',
    title: 'Previous Track / Rewind (macOS)'
  },
  {
    name: '⏩',
    code: 'KC_MFFD',
    title: 'Next Track / Fast Forward (macOS)'
  },
  { width: 250 },
  { name: '⏏️', code: 'KC_EJCT', title: 'Eject (macOS)' },

  { width: 250 },
  { name: '🔆+', code: 'KC_DBUP', title: 'Display Brightness Up' },
  { width: 250 },
  { name: '🔅-', code: 'KC_DBDN', title: 'Display Brightness Down' },

  { label: 'Mouse Keys', width: 'label' },

  { name: '🖱️ ↑', code: 'KC_MS_U', title: 'Mouse Cursor Up' },
  { name: '🖱️ ↓', code: 'KC_MS_D', title: 'Mouse Cursor Down' },
  { name: '🖱️ ←', code: 'KC_MS_L', title: 'Mouse Cursor Left' },
  { name: '🖱️ →', code: 'KC_MS_R', title: 'Mouse Cursor Right' },
  { name: '🖱️ ↖', code: 'KC_MS_UL', title: 'Mouse Cursor Up Left' },
  { name: '🖱️ ↗', code: 'KC_MS_UR', title: 'Mouse Cursor Up Right' },
  { name: '🖱️ ↙', code: 'KC_MS_DL', title: 'Mouse Cursor Down Left' },
  { name: '🖱️ ↘', code: 'KC_MS_DR', title: 'Mouse Cursor Down Right' },

  { width: 250 },
  { name: '🖱️ 1', code: 'KC_BTN1', title: 'Mouse Button 1' },
  { name: '🖱️ 2', code: 'KC_BTN2', title: 'Mouse Button 2' },
  { name: '🖱️ 3', code: 'KC_BTN3', title: 'Mouse Button 3' },
  { name: '🖱️ 4', code: 'KC_BTN4', title: 'Mouse Button 4' },
  { name: '🖱️ 5', code: 'KC_BTN5', title: 'Mouse Button 5' },
  { width: 250 },
  { name: '🖱️ ↕ ↑', code: 'KC_WH_U', title: 'Mouse Wheel Up' },
  { name: '🖱️ ↕ ↓', code: 'KC_WH_D', title: 'Mouse Wheel Down' },
  { name: '🖱️ ↔ ←', code: 'KC_WH_L', title: 'Mouse Wheel Left' },
  { name: '🖱️ ↔ →', code: 'KC_WH_R', title: 'Mouse Wheel Right' },
  { width: 250 },
  {
    name: '🖱️ acc0',
    code: 'KC_ACL0',
    title: 'Set mouse acceleration to 0'
  },
  {
    name: '🖱️ acc1',
    code: 'KC_ACL1',
    title: 'Set mouse acceleration to 1'
  },
  {
    name: '🖱️ acc2',
    code: 'KC_ACL2',
    title: 'Set mouse acceleration to 2'
  },

  { label: 'Extra FN Keys', width: 'label' },

  { name: 'F13', code: 'KC_F13' },
  { name: 'F14', code: 'KC_F14' },
  { name: 'F15', code: 'KC_F15' },
  { name: 'F16', code: 'KC_F16' },
  { name: 'F17', code: 'KC_F17' },
  { name: 'F18', code: 'KC_F18' },
  { name: 'F19', code: 'KC_F19' },
  { name: 'F20', code: 'KC_F20' },
  { name: 'F21', code: 'KC_F21' },
  { name: 'F22', code: 'KC_F22' },
  { name: 'F23', code: 'KC_F23' },
  { name: 'F24', code: 'KC_F24' }
];
