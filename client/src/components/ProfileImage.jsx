import React from 'react';
import "./ProfileImage.css";

{/* If a source is given in input, display it, otherwise use alt, which will be default picture
// Default pictures have creative commons licenses, found on google images
*/ }

// Will display an error symbol with invalid link so they know their link had a problem
var invalidSourceImage = "https://lh3.googleusercontent.com/drive-viewer/AFGJ81qzJKRoeCkxr-ex1-vTXfYDdH-DqaxvCnTxPsuXFfn43X_XRQJMl8IovuA9uRgVsw9dWa851J8ZHAOyLR5cwqdDlCr09w=s2560";
var defaultProfileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

// Can take custom class name so the css can be switched, for use in different parts of the page like the chat box
const ProfileImage = ({className, src, alt, ...props }) => {
    const invalidSourceLink = (e) => { // If the supplied source link is invalid, default to the blank one (gray silouette image)
        e.target.src = invalidSourceImage;
    }
    return (
        <div>
            {src ? (<img {...props} className={`defaultFormatting ${className}`}
                src={src} // When input source is given, use that
                alt={alt} // If an alt is given, use that
                onError={invalidSourceLink} // If given source link does not work, then call the function above to use a different one (the error symbol)
            />
            ) : (<img {...props} className={`defaultFormatting ${className}`} // When no source is given, do this...
                src={defaultProfileImage} // Use blank picture as the source
                alt={alt} />
            )}
        </div>
    );
}

export default ProfileImage