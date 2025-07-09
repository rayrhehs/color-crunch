from PIL import Image
import numpy as np
import random

# from utils.helpers import create_image, get_pixel

# def test_generator(image):
#     pixels = list(image.getdata())
#     print(image.size)
#     print("Testing!")
#     print("The length is: " + str(len(pixels))) # character length of entire pixel array
#     print("The length of one pixel array is: " + str(len(pixels[:10])))
#     print("These are the values from 0:10: " + str(pixels[20]))
#     return pixels

# ---------------
# pseudo code
# 1. get image pixel data and place it into an array -> list(image.getData()) OR use numpy array
# 2. create function(a) -> determine the rgb value with greatest range
# 3. order array based on this rgb value
# 4. find median and split array at position of median into two arrays
# 5. repeat step

def get_image_data(image): 
    pixel_array = np.array(image.getdata())
    return pixel_array

def median_cut_quantize(image_data):

    pixel_array = image_data

    r_range = np.max(image_data[:, 0]) - np.min(image_data[:, 0])
    g_range = np.max(image_data[:, 1]) - np.min(image_data[:, 1])
    b_range = np.max(image_data[:, 2]) - np.min(image_data[:, 2])

    # determine range by max - min 
    # r_range
    # g_range
    # b_range

    # if r_range > both g and b -> order array based on r color channel
    # if g_range > both r and b -> order array based on g color channel
    # if b_range > both r and g -> order array based on b color channel
    print("r_range = " + str(r_range))
    print("g_range = " + str(g_range))
    print("b_range = " + str(b_range))
    return r_range

def resolve_rgb_range(pixel_list):
    return
