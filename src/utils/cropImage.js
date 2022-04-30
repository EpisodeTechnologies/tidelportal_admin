/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} imageSrc - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */

const createImage = (url) =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
		image.src = url;
	});

function getRadianAngle(degreeValue) {
	return (degreeValue * Math.PI) / 180;
}

export default async function getCroppedImg(imageSrc, pixelCrop, resolution = {width:256,height:256},rotation = 0) {

	const image = await createImage(imageSrc)

        const canvas = document.createElement('canvas')
        canvas.width = resolution.width
        canvas.height = resolution.height
        const ctx = canvas.getContext('2d')

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            canvas.width,
            canvas.height
        )
	return canvas;
}

export const generateDownload = async (imageSrc, crop) => {
	if (!crop || !imageSrc) {
		return;
	}

	const canvas = await getCroppedImg(imageSrc, crop);

	canvas.toBlob(
		(blob) => {
			const previewUrl = window.URL.createObjectURL(blob);

			const anchor = document.createElement("a");
			anchor.download = "image.jpeg";
			anchor.href = URL.createObjectURL(blob);
			anchor.click();

			window.URL.revokeObjectURL(previewUrl);
		},
		"image/jpeg",
		0.66
	);
};
