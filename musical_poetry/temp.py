import colorsys as coloursys
import random

# LENGTH = 249950
LENGTH = 257000
BPM = 160
WIDTH = 768
HEIGHT = 432

def fix_rgb(x):
    r, g, b = x[0], x[1], x[2]
    r = max(0, min(int(r * 256), 255))
    g = max(0, min(int(g * 256), 255))
    b = max(0, min(int(b * 256), 255))
    return "#{0:02x}{1:02x}{2:02x}".format(r, g, b)

circles = []
for i in range(16):
    x = random.randrange(-25, WIDTH + 25)
    y =  5*HEIGHT/6 if (i % 2 == 0) else HEIGHT/6
    y += random.randrange(-HEIGHT/6 - 25, HEIGHT/6 + 25)
    r = random.randrange(10, 50)
    circles.append((int(x), int(y), int(r)))
random.shuffle(circles)

beat_time = int((60000/BPM)/2)
big = False
output = ""
for time in range(25500, LENGTH, beat_time):
    colour = fix_rgb(coloursys.hls_to_rgb((time % 3600)/3600, .5, 1))
    output += "Time: {}, {}\n".format(time, time + beat_time)
    for i in range(len(circles)):
        x, y, r = circles[i]
        output += "Circle: -1, {}, {}, {}, {}\n".format(colour, x, y, (r, r*2)[big ^ i%2])
    big = not big

open("out", "w").write(output)