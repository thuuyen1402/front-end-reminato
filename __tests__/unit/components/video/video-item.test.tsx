import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react"
import { VideoItem } from "@components"
import { fakeVideoData } from "__mocks__/fake/video"
import dayjs from "dayjs";
import { mockAuth } from "__mocks__/auth";
import serviceVideo from '@services/video';
import { useState } from "react";
vi.mock("@services/video")



describe("Components/video video item", () => {

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it("Contain elements with unsigned-in", async () => {
        const fakeVideoDataDefault = fakeVideoData[0];
        render(<VideoItem videoInfo={fakeVideoDataDefault} />);
        expect(await screen.findByText(fakeVideoDataDefault.title)).toBeInTheDocument();
        expect(await screen.findByText(fakeVideoDataDefault.sharedBy.email)).toBeInTheDocument();
        expect(await screen.findByText(dayjs(fakeVideoDataDefault.sharedTime).format("YYYY/MM/DD HH:mm"))).toBeInTheDocument();
        expect(await screen.findByLabelText("un-upvote")).toBeInTheDocument();
        expect(await screen.findByLabelText("un-downvote")).toBeInTheDocument();
        expect(fakeVideoDataDefault.description).toMatch(new RegExp((await screen.findByLabelText("description")).innerText, "g"))
    })
    it("Contain elements with signed-in", async () => {
        const fakeVideoDataDefault = fakeVideoData[0];
        await mockAuth();

        render(<VideoItem videoInfo={fakeVideoDataDefault} />);

        expect(await screen.findByText(fakeVideoDataDefault.title)).toBeInTheDocument();
        expect(await screen.findByText(fakeVideoDataDefault.sharedBy.email)).toBeInTheDocument();
        expect(await screen.findByText(dayjs(fakeVideoDataDefault.sharedTime).format("YYYY/MM/DD HH:mm"))).toBeInTheDocument();
        expect(await screen.findByLabelText("upvote")).toBeInTheDocument();
        expect(+((await screen.findByLabelText("upvote-count")).innerHTML)).toEqual(fakeVideoDataDefault.upvote)
        expect(await screen.findByLabelText("downvote")).toBeInTheDocument();
        expect(+((await screen.findByLabelText("downvote-count")).innerHTML)).toEqual(fakeVideoDataDefault.downvote)
        expect(fakeVideoDataDefault.description).toMatch(new RegExp((await screen.findByLabelText("description")).innerText, "g"))
    })

    it("Vote up/down", async () => {
        //Mock auth
        await mockAuth();
        //Fake data
        const fakeVideoDataDefault = fakeVideoData[0];

        //Init mock state
        const { result } = renderHook(() => useState({
            ...fakeVideoDataDefault,
            isVoteDown: false,
            isVoteUp: false,
            isVoted: false
        }));

        const [videoState, setVideoState] = result.current;

        render(<VideoItem videoInfo={videoState} />);

        // Get thump element
        const thumpUp = await screen.findByLabelText("upvote");
        const thumpDown = await screen.findByLabelText("downvote");

        // Mock api
        const mockRequest = vi.mocked(serviceVideo.videoVoteVideo).mockImplementationOnce(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return true as any
        });

        // Get count vote element
        const upvoteCount = await screen.findByLabelText("upvote-count");
        const downvoteCount = await screen.findByLabelText("downvote-count");




        //1. Vote up 
        fireEvent.click(thumpUp);
        await waitFor(() => {
            expect(mockRequest).toBeCalled();
        });

        expect(+(upvoteCount.innerHTML)).toEqual(fakeVideoDataDefault.upvote + 1)
        act(() => {
            setVideoState({
                ...videoState,
                isVoteUp: true,
                isVoted: true
            });
        })

        //Wait for update state voted
        await waitFor(() => {
            expect(result.current[0].isVoted).toBe(true);
        });


        // [videoState, setVideoState] = result.current;
        // render(<VideoItem videoInfo={videoState} />);

        //2. Vote down action  (No able)

        fireEvent.click(thumpDown);
        await waitFor(() => {
            expect(mockRequest).not.toBeCalledTimes(2);
        });

        //3. Un Vote up action  
        fireEvent.click(thumpUp);

        await waitFor(() => {
            expect(mockRequest).toBeCalledTimes(2)
        });

        expect(+(upvoteCount.innerHTML)).toEqual(fakeVideoDataDefault.upvote)
        act(() => {
            setVideoState({
                ...videoState,
                isVoteUp: false,
                isVoted: false
            });
        })

        //Wait for update state voted
        await waitFor(() => {
            expect(result.current[0].isVoted).toBe(false);
        });

        //4. Vote down action 
        fireEvent.click(thumpDown);

        await waitFor(() => {
            expect(mockRequest).toBeCalledTimes(3)
        });

        expect(+(downvoteCount.innerHTML)).toEqual(fakeVideoDataDefault.downvote + 1)
        act(() => {
            setVideoState({
                ...videoState,
                isVoteDown: true,
                isVoted: true
            });
        })

        await waitFor(() => {
            expect(result.current[0].isVoted).toBe(true);
        });

        //5. Vote up action (Not able)
        fireEvent.click(thumpUp);

        await waitFor(() => {
            expect(mockRequest).not.toBeCalledTimes(4)
        });

        //6. Un vote down action

        fireEvent.click(thumpDown);

        await waitFor(() => {
            expect(mockRequest).toBeCalledTimes(4)
        });

        expect(+(downvoteCount.innerHTML)).toEqual(fakeVideoDataDefault.downvote)
        act(() => {
            setVideoState({
                ...videoState,
                isVoteDown: false,
                isVoted: false
            });
        })

        //Wait for update state voted
        await waitFor(() => {
            expect(result.current[0].isVoted).toBe(false);
        });

    })
})