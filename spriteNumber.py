#!/usr/bin/env python3
# a quick shortcut for finding the sprite number based on its X and Y location
import sys

def findNumber(x, y):
    x = x - (x%17)
    y = y - (y%17)
    print(x/17 + (y/17) * 57)

findNumber(int(sys.argv[1]), int(sys.argv[2]))
