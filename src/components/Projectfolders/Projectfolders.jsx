import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Projectfolders.css';

const Projectfolders = () => {
    const appRef = useRef(null);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerSrc, setViewerSrc] = useState("");
    const [viewerTitle, setViewerTitle] = useState("");

    const isMobile = window.innerWidth <= 1000;
    
    // Fix for Vite Base path 404ing the images!
    const imgBase = import.meta.env.BASE_URL + "folder_design/";

    useGSAP(() => {
        if (!appRef.current) return;
        const folders = gsap.utils.toArray('.folder', appRef.current);
        const folderWrappers = gsap.utils.toArray('.folder-wrapper', appRef.current);

        // Initial positions
        gsap.set(folderWrappers, { y: isMobile ? 0 : 25 });

        // Hover events
        const cleanups = [];

        folders.forEach((folder, index) => {
            const previewImages = gsap.utils.toArray(".folder-preview-img", folder);

            const handleMouseEnter = () => {
                if (window.innerWidth <= 1000) return;

                folders.forEach((siblingFolder) => {
                    if (siblingFolder !== folder) {
                        siblingFolder.classList.add("disabled");
                    }
                });

                gsap.to(folderWrappers[index], {
                    y: 0,
                    duration: 0.25,
                    ease: "back.out(1.7)",
                });

                previewImages.forEach((img, imgIndex) => {
                    let rotation = 0;
                    if (imgIndex === 0) rotation = gsap.utils.random(-20, -10);
                    else if (imgIndex === 1) rotation = gsap.utils.random(-10, 10);
                    else rotation = gsap.utils.random(10, 20);

                    gsap.to(img, {
                        y: "-100%",
                        rotation: rotation,
                        duration: 0.25,
                        ease: "back.out(1.7)",
                        delay: imgIndex * 0.025,
                    });
                });
            };

            const handleMouseLeave = () => {
                if (window.innerWidth <= 1000) return;

                folders.forEach((siblingFolder) => {
                    siblingFolder.classList.remove("disabled");
                });

                gsap.to(folderWrappers[index], {
                    y: 25,
                    duration: 0.25,
                    ease: "back.out(1.7)",
                });

                previewImages.forEach((img, imgIndex) => {
                    gsap.to(img, {
                        y: "0%",
                        rotation: 0,
                        duration: 0.25,
                        ease: "back.out(1.7)",
                        delay: imgIndex * 0.05,
                    });
                });
            };

            folder.addEventListener("mouseenter", handleMouseEnter);
            folder.addEventListener("mouseleave", handleMouseLeave);

            cleanups.push(() => {
                folder.removeEventListener("mouseenter", handleMouseEnter);
                folder.removeEventListener("mouseleave", handleMouseLeave);
            });
        });

        return () => {
            cleanups.forEach(cleanup => cleanup());
        };

    }, { scope: appRef });

    // Separate useGSAP just for animating Modal opening since it depends on state
    useGSAP(() => {
        if (viewerOpen && appRef.current) {
             const viewerImg = appRef.current.querySelector("#viewer-img");
             if (viewerImg) {
                 gsap.fromTo(viewerImg, 
                    { scale: 0.8, opacity: 0 }, 
                    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
                 );
             }
        }
    }, [viewerOpen]);

    const openViewer = (e, src, folderName) => {
        e.stopPropagation();
        setViewerSrc(src);
        setViewerTitle(folderName + ' Preview');
        setViewerOpen(true);
    };

    return (
        <div className="folder-design-app" ref={appRef}>
            <nav>
                <p>Design Ledger</p>
                <p>Experimental</p>
            </nav>
            <div className="hero-text">
                <h1>Project Folders</h1>
            </div>
            
            <div className="folders">
                <div className="row">
                    <div className="folder variant-1">
                        <div className="folder-preview">
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image1.png", "Hackathon")}><img src={imgBase + "image1.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image2.png", "Hackathon")}><img src={imgBase + "image2.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image3.png", "Hackathon")}><img src={imgBase + "image3.png"} alt=""/></div>
                        </div>
                        <div className="folder-wrapper">
                            <div className="folder-index"><p>01</p></div>
                            <div className="folder-name"><h1>Hackathon</h1></div>
                        </div>
                    </div>
                    <div className="folder variant-2">
                        <div className="folder-preview">
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image1.png", "Playground")}><img src={imgBase + "image1.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image2.png", "Playground")}><img src={imgBase + "image2.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image3.png", "Playground")}><img src={imgBase + "image3.png"} alt=""/></div>
                        </div>
                        <div className="folder-wrapper">
                            <div className="folder-index"><p>02</p></div>
                            <div className="folder-name"><h1>Playground</h1></div>
                        </div>
                    </div>
                </div> 

                <div className="row">
                    <div className="folder variant-2">
                        <div className="folder-preview">
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image1.png", "Freelance Project")}><img src={imgBase + "image1.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image2.png", "Freelance Project")}><img src={imgBase + "image2.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image3.png", "Freelance Project")}><img src={imgBase + "image3.png"} alt=""/></div>
                        </div>
                        <div className="folder-wrapper">
                            <div className="folder-index"><p>03</p></div>
                            <div className="folder-name"><h1>Freelance Project</h1></div>
                        </div>
                    </div>
                    <div className="folder variant-3">
                        <div className="folder-preview">
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image1.png", "Upcoming Project")}><img src={imgBase + "image1.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image2.png", "Upcoming Project")}><img src={imgBase + "image2.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image3.png", "Upcoming Project")}><img src={imgBase + "image3.png"} alt=""/></div>
                        </div>
                        <div className="folder-wrapper">
                            <div className="folder-index"><p>04</p></div>
                            <div className="folder-name"><h1>Upcoming Project</h1></div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="folder variant-1">
                        <div className="folder-preview">
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image1.png", "Design Dynamic")}><img src={imgBase + "image1.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image2.png", "Design Dynamic")}><img src={imgBase + "image2.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image3.png", "Design Dynamic")}><img src={imgBase + "image3.png"} alt=""/></div>
                        </div>
                        <div className="folder-wrapper">
                            <div className="folder-index"><p>05</p></div>
                            <div className="folder-name"><h1>Design Dynamic</h1></div>
                        </div>
                    </div>
                    <div className="folder variant-2">
                        <div className="folder-preview">
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image1.png", "College Project")}><img src={imgBase + "image1.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image2.png", "College Project")}><img src={imgBase + "image2.png"} alt=""/></div>
                            <div className="folder-preview-img" onClick={(e) => openViewer(e, imgBase + "image3.png", "College Project")}><img src={imgBase + "image3.png"} alt=""/></div>
                        </div>
                        <div className="folder-wrapper">
                            <div className="folder-index"><p>06</p></div>
                            <div className="folder-name"><h1>College Project</h1></div>
                        </div>
                    </div>
                </div>
            </div> 

            {/* Image Viewer Modal Section */}
            <div className={`image-viewer ${viewerOpen ? 'active' : ''}`} id="image-viewer">
                <button className="close-viewer-btn" onClick={() => setViewerOpen(false)}>Close</button>
                <div className="viewer-content">
                    {viewerSrc && <img src={viewerSrc} alt="Project Preview" id="viewer-img" />}
                    <h2 id="viewer-title">{viewerTitle}</h2>
                    <p>This section is shown when an image is clicked!</p>
                </div>
            </div>
        </div>
    );
};

export default Projectfolders;
