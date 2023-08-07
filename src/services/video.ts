import { API_URL } from "../constants/api-url";
import api from "@utils/api";

type VideoSharing = {
    data: {
        url: string
    }
}

async function videoSharing(ctx: VideoSharing) {
    return await api.post(API_URL.VIDEO.SHARE, ctx.data)
}

type VideoGetVideos = {
    query: {
        limit?: string;
        cursor?: string
    }
}

async function videoGetVideos(ctx: VideoGetVideos) {
    const urlParams = new URLSearchParams(ctx.query);
    [...urlParams.entries()].forEach(([key, value]) => {
        if (!value || value == undefined || value == "undefined") {
            urlParams.delete(key);
        }
    });
    const cleaned = String(urlParams);
    return await api.get(API_URL.VIDEO.VIDEOS.GETS + `${cleaned != "" ? "?" + cleaned : ""}`)
}

type VideoVoteVideo = {
    body: {
        type: "up" | "down"
    },
    params: {
        id: string
    }
}

async function videoVoteVideo(ctx: VideoVoteVideo) {
    return await api.put(API_URL.VIDEO.VIDEOS.VOTE(ctx.params.id), ctx.body)
}

export default {
    videoSharing,
    videoGetVideos,
    videoVoteVideo
}