from PIL import Image
import numpy as np

# ---------------
# pseudo code
# 1. get image pixel data and place it into an array -> list(image.getData()) OR use numpy array
# 2. create function(a) -> determine the rgb value with greatest range
# 3. order array based on this rgb value
# 4. find median and split array into two
# 5. repeat steps 2 to 4 till desired palette made

def reduce_image_size(image):
  original_width, original_height = image.size
  shrink_width = 512
  aspect_ratio = original_height / original_width
  shrink_height = int(shrink_width * aspect_ratio)
  resized_img = image.resize((shrink_width, shrink_height), Image.LANCZOS)
  return resized_img


def make_pixel_array(image):
    raw_pixel_data = np.array(image.getdata())
    # generates index of flattened pixel array 
    # divided by 3 because thats how many elements per array item (rgb)
    # pixel_index_array = (len(raw_pixel_data.flatten()) // 3) - 1
    # instead of looking through pixel data, we flatten it and index original pixel array to retrieve information
    # print(raw_pixel_data[pixel_index_array])
    return raw_pixel_data #, pixel_index_array


def find_min_max(pixel_arr, pixel_index, ch_num):
  min_vals = [pixel_arr[0][0], pixel_arr[0][1], pixel_arr[0][2]]
  max_vals = [pixel_arr[0][0], pixel_arr[0][1], pixel_arr[0][2]]

  for i in range(pixel_index):
    for color in range(ch_num):
      current_pixel = pixel_arr[i][color]
      # print(f'This is current pixels value: {current_pixel}')
      if current_pixel > max_vals[color]:
        max_vals[color] = current_pixel
      elif current_pixel < min_vals[color]:
        min_vals[color] = current_pixel

  return min_vals, max_vals


def rgb_range(min, max, repeat_factor):
  ch_ranges = [0, 0, 0]

  for i in range(repeat_factor):
    ch_ranges[i] = max[i] - min[i]

  return ch_ranges


def resolve_color_channel(ch_ranges):
    
  r_range = ch_ranges[0]
  g_range = ch_ranges[1]
  b_range = ch_ranges[2]

  # IMPORTANT: this cannot handle if two channels are tied - if two color channels === the same value
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


def calculate_avg_color(bucket):
   return np.mean(bucket, axis=0)


def recursive_split(bucket, depth, max_depth):
  # base case
  if depth >= max_depth or len(bucket) <= 1:
      return [bucket]
  
  pixel_index = len(bucket)
  min_vals, max_vals = find_min_max(bucket, pixel_index, 3)
  channel_ranges = rgb_range(min_vals, max_vals, 3)
  resolved_color_channel = resolve_color_channel(channel_ranges)
  left, right = sort_and_split_by_color(bucket, resolved_color_channel)

  left_buckets = recursive_split(left, depth + 1, max_depth)
  right_buckets = recursive_split(right, depth + 1, max_depth)

  return left_buckets + right_buckets


def median_cut(image_data, target_colors=16):
  
  max_depth = int(np.log2(target_colors))

  final_buckets = recursive_split(image_data, 0, max_depth)

  new_palette = []

  for bucket in final_buckets:
     if len(bucket) > 0:
        averaged_color = calculate_avg_color(bucket)
        new_palette.append(averaged_color)

  return new_palette


def median_swap(palette, user_palette):
   reduced_palette = np.array(palette)
   target_palette = np.array(user_palette)
   
   # building list with standard python to use .append
   # converting swapped_palette to np.array in the beginning would NOT allow for the use of .append 
   # # slower process = messes up logic
   swapped_palette = []
   for color in reduced_palette:
      diffs = target_palette - color
      dists = np.sum(diffs**2, axis=1)
      idx = np.argmin(dists)
      swapped_palette.append(target_palette[idx])

   # convert back to np.array for access to data later/ease of use in other functions
   swapped_palette = np.array(swapped_palette)
   return swapped_palette


def reconstruct_data(image_data, palette):
  palette_array = np.array(palette)

  expanded_pixels = image_data[:, np.newaxis, :]
  expanded_palette = palette_array[np.newaxis, :, :]

  # print(f'Expanded pixels shape: {expanded_pixels.shape}')
  # print(f'Expanded palette shape: {expanded_palette.shape}')

  differences = expanded_pixels - expanded_palette
  squared_differences = differences ** 2
  distances = np.sum(squared_differences, axis=2)

  closest_indicies = np.argmin(distances, axis=1)

  reconstructed_data = palette_array[closest_indicies]

  return reconstructed_data


def reconstruct_image(image, image_data, palette):
   
  reconstructed_data = reconstruct_data(image_data, palette)

  reconstructed_uint8 = reconstructed_data.astype(np.uint8)
  width, height = image.size
  reconstructed_array = reconstructed_uint8.reshape(height, width, 3)
  reconstructed_image = Image.fromarray(reconstructed_array)
  
  return reconstructed_image