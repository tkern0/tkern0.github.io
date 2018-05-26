TIMES = (( 94000,  98000),
         (160000, 164000),
         (220000, 224000),
         (238000, 243000))

FADE_TIME = 1000
WIDTH = 768
HEIGHT = 432

output = open("_out", "w")
frame_time = 33
for i in TIMES:
    fade_in, fade_out = i
    colour = 255
    for time in range(fade_in, fade_in + FADE_TIME - frame_time, frame_time):
        output.write("Time: {}, {}\n".format(time, time + frame_time))
        colour_string = "#" + "{:02x}".format(int(colour)) * 3
        output.write("RectFull: -5, {}, 0, 0, {}, {}\n".format(colour_string, WIDTH, HEIGHT))
        colour -= 255 * frame_time / FADE_TIME
    output.write("Time: {}, {}\n".format(fade_in + FADE_TIME - frame_time, fade_out + FADE_TIME))
    output.write("RectFull: -5, #000000, 0, 0, {}, {}\n".format(WIDTH, HEIGHT))

    radius = 0
    max_radius = ((WIDTH/2)**2 + (HEIGHT/2)**2)**0.5
    for time in range(fade_out, fade_out + FADE_TIME, frame_time):
        output.write("Time: {}, {}\n".format(time, time + frame_time))
        output.write("CircleFull: -4, #FFFFFF, {}, {}, {}\n".format(int(WIDTH/2), int(HEIGHT/2), int(radius)))
        radius += (max_radius * frame_time) / (FADE_TIME)

    output.write("\n")

output.close()