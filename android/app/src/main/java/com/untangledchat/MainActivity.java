package com.untangledchat;

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is
   * used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "untangledchat";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashScreenTheme); // here
    super.onCreate(savedInstanceState);
  }

  @Override
  public void invokeDefaultOnBackPressed() {
    // do not call super. invokeDefaultOnBackPressed() as it will close the app.  Instead lets just put it in the background.
    moveTaskToBack(true);
  }
}
