export function cosineSimilarity(a: number[], b: number[]) {

    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

export function clusterVectors(vectors: any[]) {

    const clusters: any[] = [];

    vectors.forEach(v => {

        let foundCluster = false;

        for (const cluster of clusters) {

            const sim = cosineSimilarity(
                v.embedding,
                cluster[0].embedding
            );

            if (sim > 0.65) {

                cluster.push(v);
                foundCluster = true;
                // break;
            }

        }

        if (!foundCluster) {
            clusters.push([v]);
        }

    });

    return clusters;
};

export function groupChatsByEntry(chats: any[]) {

    const map: any = {};

    chats.forEach(chat => {

        const id = chat.entryId.toString();

        if (!map[id]) map[id] = [];

        map[id].push(...chat.messages);

    });

    return map;
};