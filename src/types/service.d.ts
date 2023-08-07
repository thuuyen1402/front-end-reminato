type NotifyServiceConsume = {
    id: string;
    sharedBy: {
        id: string;
        email: string;
    },
    thumbnails: VideoShareThumbnailsModelType;
    title: string;
    description: string;
    sharedTime: string;
    upvote: number;
    downvote: number;
}