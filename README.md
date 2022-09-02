# LightBox
Javascript module, used to show text and pictures in a modal lightbox.

The module requires to include some additional elements within the html document:
``````
    <head>
        :
1       <link rel = 'stylesheet' type='text/css' href='lightbox.min.css' />
        :
2       <script async src='lightbox.min.js'></script>
        :
    </head>
    <body>
3       <div id="anID" class="lb">
4       </div>
5       <button onclick='showLbFigure ("anID", "aPicture.jpg", "any text"); '>
:           Show the picture
:       </button>
    </body>
``````
Element #1: The appearance of the elements of the LightBox is controlled via classes, defined in the lightbox.css file.

Element #2: The Javascript LightBox module.

Element #3: The enclosing div tag of the class 'lb'. This is the LightBox element within the html document. Place this element near element #5 to make your code readable.

Element #4: The tag to close the LightBox. Place it immediately after element #3

Element #5: The Element containing the event handler to open the LightBox, a button or something similar. Place it anywhere you need.


## Functions of the LightBox module
The LightBox module provides the following functions:
``````
lb.init ();                                  // Initialization of variables (option)
lb.show (anId);                              // Show the LightBox without any content
                                             // Keyboard and mouse events are not handled by the module
lb.showLb (anId, options);                   // Show the LightBox with a close button
lb.showLbImage (anId, anImage, options);     // Show the LightBox with a close button and a image
lb.setCaption(anElement, aCaption);          // Define or redefine the caption
lb.showLbFigure (anId, anImage, aCaption, options); // Show the LightBox, button, image and caption
lb.hide ();                                  // Hide the LightBox (option)
lb.get ();                                   // Get the current LightBox element (option)
lb.getVisibility ();                         // Ask if the LightBox is visible (option)
lb.getScrollbarWidth ();                     // Get scrollbar width (option)
lb.getVersion ();                            // Get ModulVersion (option)
``````

## Parameters
The following parameters are passed:
``````
anID:            type: string         The ID of the LightBox. The ID must be unique within the html document!
anImage:         type: string         File name or url of an image that is displayed in the LightBox.
anElement:       type: object         Image object (tag) into which a caption is integrated
aCaption:        type: string         A caption
options:         type: object         Options that can be used to modify the behavior of the LightBox.
  closeButton:   type: boolean          Display of the close button (true/false)
  closeOnClick:  type: boolean          Clicking into the area of the LightBox closes it (true/false)
  keyControl:    type: boolean          Keyboard monitoring (close with ESC key) (true/false)
``````
## Hint for use
The image gets displayed on the screen as large as possible, without being cropped. Therefore it does 
not make sense to use small images together with the LightBox.
