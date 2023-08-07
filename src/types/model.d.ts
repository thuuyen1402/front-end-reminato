type VideoShareThumbnailsModelType={
  [key in "default" | "medium" | "high" | "standard" | "maxres"]: {
    url: string;
    width: number;
    height: number;
  };
}
type VideoShareModelType={
    id: string;
    title: string;
    description: string;
    videoId: string;
    thumbnails: VideoShareThumbnailsModelType;
    upvote: number;
    downvote: number;
    sharedTime: string;
    sharedBy:{
        email:string
    },
    isOwner: boolean;
    isVoteUp: boolean;
    isVoted: boolean;
    isVoteDown: boolean;
}


type UserSimpleInfo={
  id:string;
  email:string
}