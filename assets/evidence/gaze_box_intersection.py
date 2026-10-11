"""Excerpt from a video/gaze analysis script; no data or private paths included.

The function body is unchanged from the inspected analysis script.
Requirement: NumPy. This excerpt does not run YOLO or access participant data.
"""

import numpy as np


def point_box_intersect(px, py, r, x1, y1, x2, y2):
    cx = np.clip(px, x1, x2)
    cy = np.clip(py, y1, y2)
    dx = px - cx
    dy = py - cy
    return (dx*dx + dy*dy) <= (r*r)
