import React, { useEffect, useState } from 'react';
import { Box } from '@components/Box';
import IconFileZip from '@components/Svg/IconFileZip';
import IconFileFigma from '@components/Svg/IconFileFigma';
import IconFileAi from '@components/Svg/IconFileAi';
import IconFileAep from '@components/Svg/IconFileAep';
import IconFileIndd from '@components/Svg/IconFileIndd';
import IconFilePdf from '@components/Svg/IconFilePdf';
import IconFilePsd from '@components/Svg/IconFilePsd';
import IconFilePpt from '@components/Svg/IconFilePpt';
import IconFileSvg from '@components/Svg/IconFileSvg';
import IconFileJpg from '@components/Svg/IconFileJpg';
import IconFilePng from '@components/Svg/IconFilePng';
import IconFileSketch from '@components/Svg/IconFileSketch';
import IconFileOther from '@components/Svg/IconFileOther';
import IconFileFolder from '@components/Svg/IconFileFolder';
import { Image } from '@components/Image';
import { forceInt } from '@utils/forceInt';
import defaultImage from '@public/assets/icons/default-image.svg';
import defaultImagePdf from '@public/assets/icons/pdf.svg';
import { getDocument } from 'pdfjs-dist';

const extensions = {
    zip: IconFileZip,
    fig: IconFileFigma,
    ai: IconFileAi,
    aep: IconFileAep,
    indd: IconFileIndd,
    pdf: IconFilePdf,
    psd: IconFilePsd,
    ppt: IconFilePpt,
    pptx: IconFilePpt,
    svg: IconFileSvg,
    jpg: IconFileJpg,
    png: IconFilePng,
    sketch: IconFileSketch,
};

const previewables = ['jpg', 'png', 'jpeg'];

export const IconFile = ({ name, showPreviewImage, url, fileObj, size, isDirectory, isUploading = false }) => {
    const [objectUrl, setObjectUrl] = useState(null);
    const [isPdf, setIsPdf] = useState(null);

    useEffect(() => {
        if (!isUploading) {
            let fileObjUrl;
            const extension = name.split('.').pop();
            if (extension !== 'pdf') {
                if (fileObj && showPreviewImage && previewables.indexOf(extension) > -1) {
                    fileObjUrl = window.URL.createObjectURL(fileObj);
                    setObjectUrl(fileObjUrl);
                }
                return () => {
                    if (fileObjUrl) {
                        window.URL.revokeObjectURL(fileObjUrl);
                    }
                };
            }

            // ... existing code ...
            const setPdfToImage = async () => {
                try {
                    const _PDF_DOC = await getDocument({ url }).promise;
                    const canvas = document.createElement('canvas');
                    const page = await _PDF_DOC.getPage(1);
                    const viewport = page.getViewport({ scale: 1 });
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    const renderContext = {
                        canvasContext: canvas.getContext('2d'),
                        viewport,
                    };
                    await page.render(renderContext).promise;
                    const img = canvas.toDataURL('image/png');
                    setObjectUrl(img);
                    return true;
                } catch (error) {
                    console.error('Error processing PDF:', error);
                    return false;
                }
            };

            const generate = async () => {
                setIsPdf(true);
                let retryCount = 0;
                const maxRetries = 2;

                while (retryCount < maxRetries) {
                    try {
                        const success = await setPdfToImage();
                        if (success) break;
                    } catch (error) {
                        console.error(`PDF processing attempt ${retryCount + 1} failed:`, error);
                    }
                    retryCount += 1;
                    if (retryCount < maxRetries) {
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                    }
                }

                if (retryCount === maxRetries) {
                    console.error('Failed to process PDF after all retries');
                    setIsPdf(false); // Reset to show fallback
                }
            };
            generate();
            // ... existing code ...
        }
    }, [fileObj, name, showPreviewImage, url, isUploading]);

    const src = fileObj ? objectUrl : url;
    const ext = name.split('.').pop();

    let Icon = extensions[ext] ?? IconFileOther;
    if (isDirectory) {
        Icon = IconFileFolder;
    }

    if (isUploading) {
        return (
            <Box $d="inline-flex" $alignItems="center" $justifyContent="center" $fontSize={size}>
                <Icon fontSize={size} />
            </Box>
        );
    }

    if (!isPdf && showPreviewImage && previewables.indexOf(ext) > -1) {
        return (
            <Image
                src={src}
                name={name}
                size={forceInt(size)}
                $fontSize={14}
                imageProps={{ $objectFit: 'contain', h: '100%', $maxH: size, $w: 'auto', $minW: size }}
                textProps={{ $bg: 'transparent' }}
                fallbackSrc={defaultImage}
            />
        );
    }

    if (isPdf) {
        return (
            <Image
                src={objectUrl}
                name={name}
                size={forceInt(size)}
                $fontSize={14}
                imageProps={{ $objectFit: 'contain', h: '100%', $maxH: size, $w: 'auto', $minW: size }}
                textProps={{ $bg: 'transparent' }}
                fallbackSrc={defaultImagePdf}
            />
        );
    }

    return (
        <Box $d="inline-flex" $alignItems="center" $justifyContent="center" $fontSize={size}>
            <Icon fontSize={size} />
        </Box>
    );
};
