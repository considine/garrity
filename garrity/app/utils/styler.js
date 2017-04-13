exports = module.exports = {};


exports.styleLg = function (dimens) {
	var st = " .main-content-thumbnail.story-1 { ";
	st += ("background-size: " + dimens.main.lg.bgWidth + "px; ");
	st += ("background-position: " +  dimens.main.lg.bgPerc +";");
	st += "}";
	st += " .col-sm-12.col-xs-6.nested-content-col.main-content-2.content-holder {"
	st += ("background-size: " + dimens.scnd.lg.bgWidth + "px; ");
	st += ("background-position: " +  dimens.scnd.lg.bgPerc + ";");
	st += "}";
	st += " .col-sm-12.col-xs-6.nested-content-col.main-content-3.content-holder {"
	st += ("background-size: " + dimens.scnd.lg.bgWidth + "px; ");
	st += ("background-position: " +  dimens.scnd.lg.bgPerc + ";");
	st += "}";
	return st;
}
exports.styleMd = function (dimens) {
	var st = " .main-content-thumbnail.story-1 { ";
	st += ("background-size: " + dimens.main.md.bgWidth + "px; ");
	st += ("background-position: " + dimens.main.md.bgPerc + ";");
	st += "}";
	st += " .col-sm-12.col-xs-6.nested-content-col.main-content-2.content-holder {"
	st += ("background-size: " + dimens.scnd.md.bgWidth + "px; ");
	st += ("background-position: " +  dimens.scnd.md.bgPerc + ";");
	st += "}";
	st += " .col-sm-12.col-xs-6.nested-content-col.main-content-3.content-holder {"
	st += ("background-size: " + dimens.scnd.md.bgWidth + "px; ");
	st += ("background-position: " +  dimens.scnd.md.bgPerc + ";");
	st += "}";
	return st;
}
exports.styleSm = function (dimens) {
	var st = " .main-content-thumbnail.story-1 { ";
	st += ("background-size: " + dimens.main.sm.bgWidth + "px; ");
	st += ("background-position: " + dimens.main.sm.bgPerc + ";");
	st += "}";
	st += " .col-sm-12.col-xs-6.nested-content-col.main-content-2.content-holder {"
	st += ("background-size: " + dimens.scnd.sm.bgWidth + "px; ");
	st += ("background-position: " + dimens.scnd.sm.bgPerc + ";");
	st += "}";
	st += " .col-sm-12.col-xs-6.nested-content-col.main-content-3.content-holder {"
	st += ("background-size: " + dimens.scnd.sm.bgWidth + "px; ");
	st += ("background-position: " + dimens.scnd.sm.bgPerc + ";");
	st += "}";
	return st;
}
exports.styleXs = function (dimens) {
var st = " .main-content-thumbnail.story-1 { ";
	st += ("background-size: " + dimens.main.xs.bgWidth + "px; ");
	st += ("background-position: " + dimens.main.xs.bgPerc + ";");
	st += "}";
	st += " .col-sm-12.col-xs-6.nested-content-col.main-content-2.content-holder {"
	st += ("background-size: " + dimens.scnd.xs.bgWidth + "px; ");
	st += ("background-position: " + dimens.scnd.xs.bgPerc + ";");
	st += "}";
	st += " .col-sm-12.col-xs-6.nested-content-col.main-content-3.content-holder {"
	st += ("background-size: " + dimens.scnd.xs.bgWidth + "px; ");
	st += ("background-position: " + dimens.scnd.xs.bgPerc + ";");
	st += "}";
	return st;
}


