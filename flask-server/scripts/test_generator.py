from PIL import Image
import numpy as np
import random

# from utils.helpers import create_image, get_pixel

# ---------------
# pseudo code
# 1. get image pixel data and place it into an array -> list(image.getData()) OR use numpy array
# 2. create function(a) -> determine the rgb value with greatest range
# 3. order array based on this rgb value
# 4. find median and split array into two
# 5. repeat steps 2 to 4 till desired palette made

def make_pixel_array(image): 
    raw_pixel_data = np.array(image.getdata())
    pixel_array = (len(raw_pixel_data.flatten()) // 3) - 1
    # instead of looking through pixel data, we flatten it and index to retrieve information
    print(raw_pixel_data[pixel_array])
    return pixel_array

def resolve_color_channel(image_data):
    
    # determine range by max - min 
    # r_range
    # g_range
    # b_range

    # if r_range > both g and b -> order array based on r color channel
    # if g_range > both r and b -> order array based on g color channel
    # if b_range > both r and g -> order array based on b color channel

    # color_channel = 0 ADD THIS LATER TO REMOVE SO MANY RETURNS (WHY IS IT BAD PRACTICE TO HAVE THIS MANY?)

    r_range = np.max(image_data[:, 0]) - np.min(image_data[:, 0])
    g_range = np.max(image_data[:, 1]) - np.min(image_data[:, 1])
    b_range = np.max(image_data[:, 2]) - np.min(image_data[:, 2])

    print("r_range = " + str(r_range))
    print("g_range = " + str(g_range))
    print("b_range = " + str(b_range))

    if r_range > g_range and r_range > b_range:
        return 0
    if g_range > r_range and g_range > b_range:
        return 1
    if b_range > r_range and b_range > g_range:
        return 2
    
    # if for some reason they all have the same range, choose an arbitrary one - in this case, red
    return 0

def sort_and_split_by_color(image_data, color_channel):
    sort_indicies = image_data[:, color_channel].argsort() # sorts and handles correct order of indicies 
    sorted_array = image_data[sort_indicies]
    median_index = len(sorted_array) // 2
    left = sorted_array[:median_index]
    right = sorted_array[median_index:]
    return left, right

def median_cut_quantize(all_arrays):

    # assuming there are 16 subdivided arrays - for each array, find the mean of each color channel -> these will become the colors

    return