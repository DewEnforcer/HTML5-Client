class Canvas {
    static drawLine(ctx, fromX, toX, fromY, toY) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }
}