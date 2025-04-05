// pages/api/agora/token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
        console.error('Agora credentials are missing.');
        return res.status(500).json({ error: 'Agora credentials are not set.' });
    }

    const { channelName, uid } = req.query;

    if (typeof channelName !== 'string' || typeof uid !== 'string') {
        return res.status(400).json({ error: 'channelName and uid are required and must be strings.' });
    }

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTimestamp + expirationTimeInSeconds;

    try {
        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            parseInt(uid),
            role,
            privilegeExpireTime
        );
        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error generating Agora token:', error);
        return res.status(500).json({ error: 'Failed to generate token.' });
    }
}
