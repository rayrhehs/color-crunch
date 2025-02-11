from PIL import Image
import random
from utils.helpers import open_image, save_image, create_image, get_pixel

# random generator 
def random_generator(image):
  # get dimensions via .size 
  width, height = image.size 

  # create a new image and make pixel map 
  new_mdg = create_image(width, height)
  pixels = new_mdg.load()

  # pixel list containing pixel IDs
  pixelList = []
  npixelList = []

  # loop 
  for w in range(width):
    for h in range(height): 

      # get pixel information 
      pixel = get_pixel(image, w, h)

      # stores pixel RGB values 
      pixelID = [pixel[0], pixel[1], pixel[2]]

      # if the pixel ID isn't in the list, add it,
      if pixelID not in pixelList: 
        pixelList.append(pixelID)
        # piggy backing off of this 'if statement'
        # every time unique color found = add to list, make seperate list for new color palette 
        npixelList.append([random.randint(0,255), random.randint(0,255), random.randint(0,255)])

      pPos = pixelList.index(pixelID)
      npColor = npixelList[pPos]
      
      # break pixel information into rgb [0 = red, 1 = green, 2 = blue]
      red = npColor[0]
      green = npColor[1]
      blue = npColor[2]

      # rebuilds image using rgb for pixel at position [w, h]
      pixels[w, h] = (int(red), int(green), int(blue))
  
  # print(pixelList)
  # print(npixelList)
  return new_mdg


