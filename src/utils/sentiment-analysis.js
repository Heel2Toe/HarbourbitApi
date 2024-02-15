import { NlpManager } from 'node-nlp';

const manager = new NlpManager();

const sentimentAnalysis = async (text) => {
    const response = await manager.process('en', text);
    const sentiment = response.sentiment;
    return sentiment.vote;
}

export default sentimentAnalysis;
