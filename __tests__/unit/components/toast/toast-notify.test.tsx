import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ToastNotify } from "@components"
import { fakeVideoData } from "__mocks__/fake/video"
import dayjs from "dayjs";
import { fakeOptionToast } from "__mocks__/fake/toast";
import toast from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
vi.stubGlobal('open', vi.fn());


describe("Components/video video item", () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it("Contain elements", async () => {
        const fakeVideoDataDefault = fakeVideoData[0];
        render(<ToastNotify t={fakeOptionToast} info={{
            title: fakeVideoDataDefault.title,
            description: fakeVideoDataDefault.description,
            downvote: fakeVideoDataDefault.downvote,
            upvote: fakeVideoDataDefault.upvote,
            id: fakeVideoDataDefault.id,
            sharedBy: fakeVideoDataDefault.sharedBy,
            sharedTime: fakeVideoDataDefault.sharedTime,
            thumbnails: fakeVideoDataDefault.thumbnails
        }} />);


        expect(await screen.findByText(fakeVideoDataDefault.title)).toBeInTheDocument();

        const image = await screen.findByLabelText("notify-thumbnail");
        expect(image).toBeInTheDocument();
        expect((image as HTMLImageElement)?.src).toBe(fakeVideoDataDefault.thumbnails["default"].url)

        expect(await screen.findByText(fakeVideoDataDefault.sharedBy.email)).toBeInTheDocument();
        expect(await screen.findByText(dayjs(fakeVideoDataDefault.sharedTime).format("HH:mm"))).toBeInTheDocument();

        expect(await screen.findByText("Watch")).toBeInTheDocument()
        expect(await screen.findByText("Close")).toBeInTheDocument()

    });

    it("Closing toast notify", async () => {
        const fakeVideoDataDefault = fakeVideoData[0];
        render(<ToastNotify t={fakeOptionToast} info={{
            title: fakeVideoDataDefault.title,
            description: fakeVideoDataDefault.description,
            downvote: fakeVideoDataDefault.downvote,
            upvote: fakeVideoDataDefault.upvote,
            id: fakeVideoDataDefault.id,
            sharedBy: fakeVideoDataDefault.sharedBy,
            sharedTime: fakeVideoDataDefault.sharedTime,
            thumbnails: fakeVideoDataDefault.thumbnails
        }} />, { wrapper: BrowserRouter });


        const closeButton = await screen.findByText("Close")
        expect(closeButton).toBeInTheDocument();

        const mockToastDismiss = vi.spyOn(toast, "dismiss");

        fireEvent.click(closeButton);
        expect(mockToastDismiss).toBeCalledWith(fakeOptionToast.id)
    });

    it("Open new video tab", async () => {

        const fakeVideoDataDefault = fakeVideoData[0];
        render(<ToastNotify t={fakeOptionToast} info={{
            title: fakeVideoDataDefault.title,
            description: fakeVideoDataDefault.description,
            downvote: fakeVideoDataDefault.downvote,
            upvote: fakeVideoDataDefault.upvote,
            id: fakeVideoDataDefault.videoId,
            sharedBy: fakeVideoDataDefault.sharedBy,
            sharedTime: fakeVideoDataDefault.sharedTime,
            thumbnails: fakeVideoDataDefault.thumbnails
        }} />);

        const watchATag = await screen.findByText("Watch")

        expect(watchATag).toBeInTheDocument();

        fireEvent.click(watchATag);

        await waitFor(() => {
            expect(window.open).toBeCalledWith(`https://youtube.com/watch?v=${fakeVideoDataDefault.videoId}`, '_blank')
        })

    })
})