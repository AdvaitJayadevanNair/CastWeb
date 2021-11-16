export const ICE_config = {
  iceServers: [
    {
      urls: [
        'turn:173.194.72.127:19305?transport=udp',
        'turn:[2404:6800:4008:C01::7F]:19305?transport=udp',
        'turn:173.194.72.127:443?transport=tcp',
        'turn:[2404:6800:4008:C01::7F]:443?transport=tcp',
      ],
      username: 'CKjCuLwFEgahxNRjuTAYzc/s6OMT',
      credential: 'u1SQDR/SQsPQIxXNWQT7czc/G4c=',
    },
    { urls: ['stun:stun.l.google.com:19302'] },
  ],
};
